// Load the speak packages.
var Speak = require('./speak.js');
var SpamFilter = require('./spamfilter.js');
var Idle = require('./idle.js');
var copyright = require('./copyright.js');
var Anniversary = require('./anniversary.js');
var schedule = require('node-schedule');

var Bot = function (client, config) {
    this.commands = ['who', 'echo'];
    this.client = client;
    this.status = config.bot_status;
    this.admins = config.admins;
    this.prefix = config.prefix;
    this.defaultChannelId = config.default_channel_id;
    this.channel;
    this.speak = new Speak();
    this.anniversary = new Anniversary(client);
    this.idle = new Idle(this.speak, config.idle_channels, config.idle_timeout);
    this.spamFilter = new SpamFilter(config.timeout);
    this.validCommands = this.speak.commands.concat(this.commands);
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
        var isDm = channel.type === 'dm';

        // Update idle timer.
        this.idle.update(channel);

        var message = msg.content.trim();
        // Only act on commands starting with the prefix (default: !).
        if (message.substring(0, 1) !== this.prefix) {
            return;
        }

        // Split message between command and rest.
        var matches = message.match(/^[^\w]*([\w]+)\s*(.*)$/);
        if (matches === null) {
            return;
        }
        var cmd = matches[1].toString().toLowerCase();
        var rest = matches[2];
        if (!this.isValidCommand(cmd)) {
            return;
        }

        // Prevent flooding/spamming if it's not DM.
        if (!isDm && this.spamFilter.isSpam(user)) {
            return;
        }

        // Switch between commands, bot-commands always take preference over speak commands.
        switch (cmd) {
            case 'who':
                channel.send(copyright(isDm));
                break;
            case 'echo':
                if (this.channel && this.isAdmin(user.id)) {
                    this.channel.send(rest);
                }
                break;
            default:
                if (this.speak.hasDict(cmd)) {
                    var message = this.speak.getSentence(cmd, user.username);
                    channel.send(message);
                }
        }
    },
    /**
     * Return true if command is valid.
     * @param {String} cmd
     * @returns {Boolean}
     */
    isValidCommand: function (cmd) {
        return this.validCommands.indexOf(cmd) > -1;
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
