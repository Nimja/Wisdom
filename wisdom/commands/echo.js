const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    'echo': {
        disabled: false,
        guild: true,
        config: new SlashCommandBuilder()
            .setName('echo')
            .setDescription('Send a text as Wisdom to the current channel.')
            .addChannelOption(option =>
                option.setName('channel')
                    .setDescription('Which channel to post it in.')
                    .setRequired(true)
            )
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
    var channel = interaction.options.get('channel');
    if (!!channel) {
        channel = channel.channel;
    }
    var text = interaction.options.get('text');
    text = text ? text.value.trim() : '';
    if (!interaction.channel || !text) {
        return reply("Sorry, no.");
    }
    console.log(channel.name, text);
    if (!channel || !channel.guild) {
        console.log(interaction.channel, channel, text);
        return reply("No channel?.");
    }
    handleEcho(interaction, channel, text);
    return false;
};

/**
 * We send a response, post it to the channel, post success and then remove that response.
 */
async function handleEcho(interaction, channel, text) {
    let quoted = quote(text);
    let channelName = "#" + channel.name;
    await interaction.reply(reply(`Sending to: ${channelName}...${quoted}`));
    await channel.send(text);
    await interaction.editReply(reply(`Success! This message will self-destruct in 1 second...`));
    await wait(1000);
    await interaction.deleteReply();
}


function reply(msg) {
    return { ephemeral: true, content: msg }
}

function quote(text) {
    let separator = "\n> ";
    return separator + text.split("\n").join(separator);
}