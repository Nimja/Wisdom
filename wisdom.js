// Load configuration.
var config = require('./config.json');

// Load libraries.
var Bot = require('./wisdom/bot.js');
var Discord = require('discord.js');

// Initialize Discord Bot
console.log('Initializing...');
var client = new Discord.Client();
var bot = new Bot(config);

// Report errors, if/when they occur.
client.on('error', error => {
    console.log(error);
});

// Reporting we have connected.
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus(config.bot_status);
});

// Handle a message.
client.on('message', msg => {
    bot.handleMessage(msg);
});

// Do actual login.
client.login(config.token);
