const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    'suggest': {
        config: new SlashCommandBuilder()
            .setName('suggest')
            .setDescription('Anonymously suggest (or report) something.')
            .addStringOption(option =>
                option.setName('content')
                    .setDescription('Your message.')
                    .setRequired(true)
            )
            .toJSON(),
        handler: handle
    },
}

const Global = require('./../global.js');
const global = new Global();

function quote(text) {
    let separator = "\n> ";
    return separator + text.split("\n").join(separator);
}

function handle(interaction) {
    var rest = interaction.options.get('content');
    rest = rest ? rest.value.trim() : '';
    var quoted = quote(rest);
    var reported = false;
    // Report in admin DM.
    var reportUser = global.getData('reportUser');
    if (reportUser) {
        reportUser.send("Suggestion: " + quoted);
        reported = true;
    }
    // Report in server channel.
    var reportChannel = global.getData('reportChannel');
    if (reportChannel) {
        console.log("Reporting to channel")
        reportChannel.send("Suggestion: " + quoted);
        reported = true;
    }

    if (!reported) {
        return reply("ERROR: I'm sorry, I couldn't send it anywhere? - Please check with a admin: " + quoted);
    }
    return reply("Thank you, I've passed it through: " + quoted);
};


function reply(msg) {
    return { ephemeral: true, content: msg }
}