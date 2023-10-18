// Load configuration.
const config = require('./config.json');
require('./wisdom/log_timestamp.js');

// Get remaining command-line arguments.
const argv = process.argv.slice(2);


if (argv.length > 0 && argv[0]) { // For single commands.
    global.isConsole = true;
    if (argv[0] == 'sync') {
        const SyncCommands = require('./console/sync_commands.js');
        const sync = new SyncCommands(config);
        sync.run();
    } else {
        console.log("Nothing to do...");
    }
} else { // Load the actual bot, best run in nodemon.
    global.isConsole = false;

    // Load libraries.
    require('nodemon'); // Marked so that it's a 'used package'.
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
}
