// Load configuration.
var config = require('./config.json');

// Load the speak packages.
var Speak = require('./speak');
var Spamfilter = require('./speak/spamfilter.js');
var Idle = require('./speak/idle.js');
var copyright = require('./speak/copyright.js');

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
    var isDm = channel.type === 'dm';
    // Update idle timer.
    idle.update(channel);

    var message = msg.content;
    // Only act on commands starting with the prefix (default: !).
    if (message.substring(0, 1) !== config.prefix) {
        return;
    }

    // Check for spamming (with a timeout per userId).
    var timeout = isDm ? 0 : spamfilter.getTimeout(user.id);
    if (timeout > 0) {
        user.send("Patience, " + user.name + "... " + timeout + " more seconds. In private is fine though.");
        return;
    }

    //Handle command.
    var args = message.substring(1).split(' ');
    var cmd = args[0];
    args = args.splice(1);
    if (speak.hasDict(cmd)) {
        var message = speak.getSentence(cmd, user.username);
        channel.send(message);
    } else {
        switch (cmd) {
            case 'who':
                channel.send(copyright(isDm));
                break;
        }
    }
});
