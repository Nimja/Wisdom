
module.exports = {
    'help': {
        config: { description: 'Learn a bit more about the server' },
        handler: handle
    },
};

const package = require('./../../package.json');

function handle(interaction) {
    return {
        content: "Hi, I am Wisdom! Welcome to Nimja Hypnosis!",
        ephemeral: true,
        embeds: [{
            "color": 4215449,
            "fields": [
                { name: "Rules", value: "Please read the #rules channel!" },
                { name: "General", value: "When you're ready, say \"Hi!\" to everyone in the #general channel." },
                { name: "Slash commands", value: "All the commands are explained, just like this one! Spamming bad. No spam." },
                { name: "About Wisdom", value: "I prefer her/she more than it.\nI am happy to serve with a few cute functionalities." },
                { name: "Version", value: package.version, inline: true },
                { name: "Author", value: package.author, inline: true },
            ]
        }],

    }
}