var Speak = require('./speak.js');
var Command = require('./command.js');
var SpamFilter = require('./spamfilter.js');
var Idle = require('./idle.js');
var Anniversary = require('./anniversary.js');
var schedule = require('node-schedule');

var Bot = function (client, config) {
    this.commands = ['who', 'echo'];
    this.client = client;
    this.status = config.bot_status;
    this.admins = config.admins;
    this.defaultChannelId = config.default_channel_id;
    this.channel;
    this.speak = new Speak();
    this.command = new Command(config.prefix, this.speak);
    this.anniversary = new Anniversary(client);
    this.idle = new Idle(this.speak, config.idle_channels, config.idle_timeout);
    this.spamFilter = new SpamFilter(config.timeout);
};

module.exports = Bot;

Bot.prototype = {
    /**
     * Init methods and set up scheduler.
     */
    init: function() {
        this.client.user.setStatus(this.status);
        this.channel = this.client.channels.get(this.defaultChannelId);
        if (this.channel) {
            this.anniversary.init(this.channel);
            schedule.scheduleJob('0 11 * * *', this.daily.bind(this));
        } else {
            console.error("ERROR: Unable to load default channel, echo and anniversary will not work!");
        }
    },
    /**
     * Daily jobs, this allows for actions not tied to a message.
     */
    daily: function() {
        this.anniversary.callout();
    },
    /**
     * Handle a message from Discord.
     *
     * @param {Message} msg
     */
    handleMessage: function (msg) {
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
            if (msg.isMentioned(this.client.user) && this.command.speak.hasDict('mentioned')) {
                cmd= {command: 'mentioned', rest: ''};
            } else {
                return;
            }
        }

        // Prevent flooding/spamming if it's not DM.
        if (!isDm && !isAdmin && this.spamFilter.isSpam(user)) {
            return;
        }
        // Setup environment for command, and execute.
        var env = {
            isDm: isDm,
            isAdmin: isAdmin,
            defaultChannel: this.channel,
            client: this.client,
            mentions: msg.mentions,
            user: user,
            channel: channel
        };
        this.command.execute(cmd, env);
    },
    /**
     * Handle a message from Discord.
     *
     * @param {Message} msg
     */
    handleJoin: function (user) {
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
        this.command.execute({command: 'intro', rest: ''}, env);
    },
    /**
     * Return true if user is admin.
     * @param {String} userId
     * @returns {Boolean}
     */
    isAdmin: function(userId) {
        return this.admins.indexOf(userId) > -1;
    }
};
