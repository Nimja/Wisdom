// Load configuration.
const config = require('./config.json');
require('./wisdom/log_timestamp.js');

// Load libraries.
const Bot = require('./wisdom/bot.js');
const { Client, GatewayIntentBits } = require('discord.js');

// Initialize Discord Bot
console.log('Initializing...');
const client = new Client(
    {
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.DirectMessages
        ]
    }
);
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

// React to being added as a guild member (new user).
client.on('guildMemberAdd', member => {
    console.log(" - - Greeting - - ", member.displayName);
    bot.handleNewMember(member);
});

// Do actual login.
client.login(config.token);
