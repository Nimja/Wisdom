module.exports = {
    'suggest': {
        config: {
            description: 'Anonymously suggest (or report) something.',
            options: [{
                name: 'content',
                type: 'STRING',
                description: 'Content',
                required: true,
            }]
        },
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
    var reportUser = global.getData('reportUser');
    if (!reportUser) {
        return reply("Sorry, currently not working...")
    }
    var quoted = quote(rest);
    reportUser.send("Suggestion: " + quoted);
    return reply("Thank you, I've passed it through: " + quoted);
};


function reply(msg) {
    return { ephemeral: true, content: msg }
}