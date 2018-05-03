// Load configuration and package information.
var config = require('./config.json');
var package = require('./package.json');

// Load the speak packages.
var Speak = require('./speak');
var Spamfilter = require('./speak/spamfilter.js');
var Idle = require('./speak/idle.js');

// Load the Discord bot.
var Discord = require('discord.js');

// Setup speak, spamfilter and idle timer.
var speak = new Speak();
var spamfilter = new Spamfilter(config.timeout);
var idle = new Idle(speak, config.idle_channels, config.idle_timeout);

console.log('Initializing...');

// Initialize Discord Bot
var client = new Discord.Client();

// Report errors, if/when they occur.
client.on('error', error => {
    console.log(error);
});

// Reporting we have connected.
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus('invisible');
});

client.login(config.token);

client.on('message', msg => {
    var user = msg.author;
    //Don't react to bots.
    if (user.bot) {
        return;
    }
    var channel = msg.channel;
    // Update idle timer.
    idle.update(channel);

    var message = msg.content;
    // Only act on commands starting with the prefix (default: !).
    if (message.substring(0, 1) !== config.prefix) {
        return;
    }

    // Check for spamming (with a timeout per userId).
    var timeout = channel.type !== 'dm' ? spamfilter.getTimeout(user.id) : 0;
    if (timeout > 0) {
        var message = "Not too often... You need to wait " + timeout + " more seconds...";
        user.sendMessage(message);
        return;
    }

    //Handle command.
    var args = message.substring(1).split(' ');
    var cmd = args[0];
    args = args.splice(1);
    if (speak.hasDict(cmd)) {
        var message = speak.getSentence(cmd, user.username);
        channel.sendMessage(message);
    } else {
        switch (cmd) {
            case 'who':
                var message = package.name + ' v' + package.version + ' - ' + package.description;
                channel.sendMessage(message);
                break;
        }
    }
});
