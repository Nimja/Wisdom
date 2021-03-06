var Speak = require('./speak/speak.js');
var Command = require('./command.js');
var SpamFilter = require('./spamfilter.js');
var Idle = require('./idle.js');
var Anniversary = require('./anniversary.js');
var schedule = require('node-schedule');
var Discord = require('discord.js');

class Bot {
    constructor(client, config) {
        this.client = client;
        this.status = config.bot_status;
        this.admins = config.admins;
        this.reportUserId = config.report_user;
        this.reportUser;
        this.defaultChannelId = config.default_channel;
        this.channel;
        this.speak = new Speak();
        this.command = new Command(config, this.speak);
        this.anniversary = new Anniversary(client);
        this.idle = new Idle(this.speak, config.idle_channels, config.idle_timeout);
        this.spamFilter = new SpamFilter(config.timeout);
    }

    /**
     * Init methods and set up scheduler.
     */
    init() {
        this.client.user.setStatus(this.status);
        // Set reporting user
        // var this = this;
        this.client.users.fetch(this.reportUserId).then(
            user => {
                this.reportUser = user;
            }
        )
        this.client.channels.fetch(this.defaultChannelId).then(
            channel => {
                this.channel = channel;
                this.anniversary.init(this.channel);
                schedule.scheduleJob('0 11 * * *', this.daily.bind(this));
            }
        );
    }
    /**
     * Daily jobs, this allows for actions not tied to a message.
     */
    daily() {
        this.anniversary.callout();
    }
    /**
     * Handle a message from Discord.
     *
     * @param {Message} msg
     */
    handleMessage(msg) {
        var user = msg.author;
        // Don't react to bots.
        if (user.bot) {
            return;
        }
        var channel = msg.channel;
        var isDm = msg.channel.type === 'dm';
        var isAdmin = this.isAdmin(user.id);

        // Update idle timer.
        this.idle.update(channel);

        var cmd = this.command.getCommand(msg.content.trim());
        if (!cmd) {
            if (msg.mentions.users.get(this.client.user.id) && this.command.speak.hasDict('mentioned')) {
                // Until discord.js supports replies in version 13, I have disabled this.
                cmd = { command: 'mentioned', rest: '' };
                return;
            } else {
                return;
            }
        }

        // Prevent flooding/spamming if it's not DM.
        if (!isDm && !isAdmin && this.spamFilter.isSpam(user)) {
            return;
        }
        // Setup environment for command, and execute.
        var env = new Env({
            isDm: isDm,
            isAdmin: isAdmin,
            defaultChannel: this.channel,
            reportUser: this.reportUser,
            client: this.client,
            mentions: msg.mentions,
            guild: msg.guild,
            user: user,
            channel: channel
        });
        this.command.execute(cmd, env);
    }
    /**
     * Handle a message from Discord.
     *
     * @param {Message} msg
     */
    handleJoin(user) {
        // Don't react to bots.
        if (user.bot) {
            return;
        }
        var isAdmin = this.isAdmin(user.id);
        // Setup environment for command, and execute.
        var env = {
            isDm: true,
            isAdmin: isAdmin,
            defaultChannel: this.channel,
            client: this.client,
            user: user,
            channel: user
        };
        this.command.execute({ command: 'intro', rest: '' }, env);
    }
    /**
     * Return true if user is admin.
     * @param {String} userId
     * @returns {Boolean}
     */
    isAdmin(userId) {
        return this.admins.indexOf(userId) > -1;
    }
};

/**
 * Holder for convenience methods.
 */
class Env {
    constructor(obj) {
        for (let i in obj) {
            this[i] = obj[i];
        }
    }
    getUserName(includeMentions) {
        let user = this.user;
        let first = this.mentions.users.first();
        if (includeMentions && first && !first.bot) {
            user = first;
        }
        let username = user.username;
        if (this.guild) {
            username = this.guild.member(user).displayName;
        }
        return this.escape(username);
    }
    escape(str) {
        return Discord.escapeMarkdown(str);
    }
}


module.exports = Bot;