const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    'echo': {
        disabled: false,
        config: new SlashCommandBuilder()
            .setName('echo')
            .setDescription('Send a text as Wisdom to the current channel.')
            .addStringOption(option =>
                option.setName('text')
                    .setDescription('Text to say in this channel.')
                    .setRequired(true)
            )
            .toJSON(),
        handler: handle
    },
}

function handle(interaction) {
    var text = interaction.options.get('text');
    text = text ? text.value.trim() : '';
    interaction.channel.send(text)
    return reply("Sent!");
};


function reply(msg) {
    return { ephemeral: true, content: msg }
}