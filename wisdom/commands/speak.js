
module.exports = {
    'decide': {
        config: { description: 'A yes/no decision' },
        handler: handle
    },
    'question': {
        config: { description: 'Get a random question?' },
        handler: handle
    },
    'dream': {
        config: {
            description: 'Allow wisdom to inspire you a dream.',
            options: [{
                name: 'user',
                type: 'USER',
                description: 'Dreamer',
                required: false,
            }]
        },
        handler: handle
    },
    'bun': {
        config: {
            description: 'Throw a bunny as pun-ishment.',
            options: [{
                name: 'user',
                type: 'USER',
                description: 'Target',
                required: true,
            }]
        },
        handler: handle
    },
    'hug': {
        config: {
            description: 'Give someone a hug.',
            options: [{
                name: 'user',
                type: 'USER',
                description: 'Who',
                required: true,
            }]
        },
        handler: handle
    },
    'compliment': {
        config: { description: '' },
        config: {
            description: 'Give a random compliment.',
            options: [{
                name: 'user',
                type: 'USER',
                description: 'To',
                required: true,
            }]
        },
        handler: handle
    },

};

const Speak = require('../speak/speak.js');
const Discord = require('discord.js');
const speak = new Speak();

function handle(interaction) {
    var dict = interaction.commandName;
    let displayName = interaction.user.displayName ? interaction.user.displayName : interaction.user.username;

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
        if (user && !user.user.bot) {
            member = user.member;
        }
        displayName = member.displayName ? member.displayName : member.user.username;
    }
    return speak.getSentence(dict, Discord.escapeMarkdown(displayName));
}
