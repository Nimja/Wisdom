const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    'help': {
        config: new SlashCommandBuilder()
            .setName('help')
            .setDescription('Learn a bit more about the server.')
            .toJSON(),
        handler: handle,
        getMessage: createWelcomeMessage
    },
};

const package = require('./../../package.json');

// Create message.
var message_template = require('../data/help_text.json');
var fields = [
    { name: "Wisdom pronoun", value: "She/her", inline: true },
    { name: "Version", value: package.version, inline: true },
    { name: "Author", value: package.author, inline: true },
];
// Add extra static fields.
message_template.embeds[0].fields = message_template.embeds[0].fields.concat(fields);

function handle(interaction) {
    message = createWelcomeMessage();
    message.ephemeral = true;
    return message;
}

function createWelcomeMessage() {
    return message_template
}