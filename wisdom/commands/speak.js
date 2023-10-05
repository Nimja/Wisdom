const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    'decide': {
        config: new SlashCommandBuilder()
            .setName('decide')
            .setDescription('A yes/no decision')
            .toJSON(),
        handler: handle
    },
    'question': {
        config: new SlashCommandBuilder()
            .setName('question')
            .setDescription('Get a random question?')
            .toJSON(),
        handler: handle
    },
    'dream': {
        config: new SlashCommandBuilder()
            .setName('dream')
            .setDescription('Allow wisdom to inspire you a dream.')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('Dreamer?')
                    .setRequired(false)
            )
            .toJSON(),
        handler: handle
    },
    'bun': {
        config: new SlashCommandBuilder()
            .setName('bun')
            .setDescription('Throw a bunny as pun-ishment.')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('Target')
                    .setRequired(true)
            )
            .toJSON(),
        handler: handle
    },
    'hug': {
        config: new SlashCommandBuilder()
            .setName('hug')
            .setDescription('Give someone a hug.')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('Who gets a hug?')
                    .setRequired(true)
            )
            .toJSON(),
        handler: handle
    },
    'compliment': {
        config: new SlashCommandBuilder()
            .setName('compliment')
            .setDescription('Give someone a compliment.')
            .addUserOption(option =>
                option.setName('user')
                    .setDescription('Who\'s been good?')
                    .setRequired(true)
            )
            .toJSON(),
        handler: handle
    },

};

const Speak = require('../speak/speak.js');
const Discord = require('discord.js');
const speak = new Speak();

function handle(interaction) {
    var dict = interaction.commandName;
    let displayName = interaction.user.displayName || interaction.user.username;

    // In a guild we allow for some extra options.
    if (interaction.guild) {
        // Support for alternate dictionaries based on channel name (or parent if thread).
        var dict_choice = dict + '_' + interaction.text_channel_name
        if (speak.hasDict(dict_choice)) {
            dict = dict_choice
        }

        // Support for calling out users by their guild display name.
        let member = interaction.member;
        const user = interaction.options.get('user');
        // Allow people to hug/bun/compliment others, but not bots.
        if (user && !user.user.bot && user.member) {
            member = user.member;
        }
        // Pick the first name that is good.
        displayName = member.nickname || member.displayName || member.user.displayName || member.user.username;
    }
    return speak.getSentence(dict, Discord.escapeMarkdown(displayName));
}
