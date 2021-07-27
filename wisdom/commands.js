const fs = require('fs');

class Commands {
    constructor(client) {
        this.client = client;
        this.commands = {};
        this.commandList = [];
    }
    loadCommands() {
        const commandFiles = fs.readdirSync('./wisdom/commands').filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            let config = require(`./commands/${file}`);
            // One file can contain multiple commands.
            for (var i in config) {
                this.addCommand(i, config[i]);
            }
        }
    }

    init(guild) {
        this.loadCommands();
        // Set global commands.
        this.client.application.commands.set(this.commandList).catch(console.error);
        // Set guild commands.
        this.client.application.commands.set(this.commandList, guild.id)
            // .then(console.log)
            .catch(
                e => { console.error(e, e.requestData); }
            );

    }
    addCommand(name, command) {
        command.config.name = name;
        this.commands[name] = command;
        this.commandList.push(command.config);
        return command;
    }

    handle(interaction) {
        if (!(interaction.commandName in this.commands)) {
            var result = 'Unknown command...';
        } else {
            var result = this.commands[interaction.commandName].handler(interaction);
        }
        interaction.reply(result);
    }
}

module.exports = Commands;