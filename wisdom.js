// Load configuration.
const config = require('./config.json');

// Load libraries.
const Bot = require('./wisdom/bot.js');
const { Client, Intents } = require('discord.js');

// Initialize Discord Bot
console.log('Initializing...');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES] });
const bot = new Bot(client, config);

// Report errors, if/when they occur.
client.on('error', error => {
    console.error(error);
});

// Reporting we have connected.
client.on('ready', () => {
    console.log(`Logged in as: ${client.user.tag}`);
    bot.init();
});

// React to commands.
client.on('interactionCreate', interaction => {
    if (!interaction.isCommand()) return;
    bot.handleCommand(interaction);
});

// Do actual login.
client.login(config.token);
