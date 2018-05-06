// Load the speak packages.
var Speak = require('./speak.js');
var SpamFilter = require('./spamfilter.js');
var Idle = require('./idle.js');
var copyright = require('./copyright.js');

var Bot = function (config) {
    this.commands = ['who'];
    this.prefix = config.prefix;
    this.speak = new Speak();
    this.idle = new Idle(this.speak, config.idle_channels, config.idle_timeout);
    this.spamFilter = new SpamFilter(config.timeout);
    this.validCommands = this.speak.commands.concat(this.commands);
};

module.exports = Bot;

Bot.prototype = {
    handleMessage: function(msg) {
        var user = msg.author;
        //Don't react to bots.
        if (user.bot) {
            return;
        }
        var channel = msg.channel;
        var isDm = channel.type === 'dm';

        // Update idle timer.
        this.idle.update(channel);

        var message = msg.content;
        // Only act on commands starting with the prefix (default: !).
        if (message.substring(0, 1) !== this.prefix) {
            return;
        }

        //Handle command.
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        if (!this.isValidCommand(cmd)) {
            return;
        }
        args = args.splice(1);

        if (!isDm && this.spamFilter.isSpam(user)) {
            return;
        }

        if (this.speak.hasDict(cmd)) {
            var message = this.speak.getSentence(cmd, user.username);
            channel.send(message);
        } else {
            switch (cmd) {
                case 'who':
                    channel.send(copyright(isDm));
                    break;
            }
        }
    },
    isValidCommand: function(cmd) {
        return this.validCommands.indexOf(cmd) > -1;
    }
};
