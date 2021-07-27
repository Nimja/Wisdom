
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
    var channel = interaction.channel.name;
    var dict_choice = `${dict}_${channel}`
    if (speak.hasDict(dict_choice)) {
        dict = dict_choice
    }
    let displayName = interaction.user.username;
    // We are in a guild, so get the member name.
    if (interaction.guild) {
        displayName = interaction.member.displayName;
        const user = interaction.options.get('user');
        // Allow people to hug/bun/compliment others, but not bots.
        if (user && !user.user.bot) {
            displayName = user.member.displayName;
        }
    }
    return speak.getSentence(dict, Discord.Util.escapeMarkdown(displayName));
}