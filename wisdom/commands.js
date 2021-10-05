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
        this.client.application.commands.fetch().then(this.syncCommands.bind(this));
        // Set global commands.
        // this.client.application.commands.set(this.commandList).then().catch(console.error);
        // Set guild commands, the same commands will show twice!
        // this.client.application.commands.set([], guild.id).catch(console.error);
    }
    addCommand(name, command) {
        command.config.name = name;
        this.commands[name] = command;
        this.commandList.push(command.config);
        return command;
    }

    syncCommands(commands) {
        var requested = Object.keys(this.commands);
        commands.forEach(command => {
            let name = command.name;
            let index = requested.indexOf(name);
            if (index < 0) {
                // Removed from command list.
                console.log("REMOVING command:", name);
                this.client.application.commands.delete(command).catch(console.error);
            } else {
                // Remove from requested.
                requested.splice(index, 1);
            }
        });
        // Adding new/missing commands.
        requested.forEach(name => {
            console.log("ADDING command  : ", name);
            this.client.application.commands.create(this.commands[name].config).catch(console.error);
        });
    }

    handle(interaction) {
        if (!(interaction.commandName in this.commands)) {
            var result = 'Unknown command...';
        } else {
            var result = this.commands[interaction.commandName].handler(interaction);
        }
        interaction.reply(result);
    }

    /**
     * Only time we use a direct command.
     * @param {GuildMember} member
     */
    sendWelcome(user) {
        if (!user.bot) {
            user.send(this.commands['help'].getMessage());
        }
    }
}

module.exports = Commands;