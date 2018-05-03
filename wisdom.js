var Discord = require('discord.io');
var config = require('./config.json');
var Speak = require('./speak');
var package = require('./package.json');

var speak = new Speak();

console.log('Initializing...');

// Initialize Discord Bot
var bot = new Discord.Client({
    token: config.token,
    autorun: true
});
// Reporting we have connected.
bot.on('ready', function () {
    console.log('Connected');
    console.log('Logged in as: ' + bot.username + ' - (' + bot.id + ')');
});
// Main method, handling the message.
bot.on('message', function (user, userID, channelID, message, evt) {
    // Only act on commands starting with the prefix (default: !).
    if (message.substring(0, 1) !== config.prefix) {
        return;
    }

    var args = message.substring(1).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    if (speak.hasDict(cmd)) {
        var message = speak.getSentence(cmd, user);
        bot.sendMessage({to: channelID, message: message});
    } else {
        switch (cmd) {
            case 'who':
                var message = package.name + ' v' + package.version + ' - ' + package.description;
                bot.sendMessage({to: channelID, message: message});
                break;
        }
    }
});
bot.on('error', function (evt) {
    console.log(evt);
});