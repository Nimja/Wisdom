const fs = require('fs');
const wisdomConfig = require('../config.json');

class Commands {
    constructor(client) {
        this.client = client;
        this.commands = {};
        this.activeCommands = [];
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
        // Fetch all commands we have, then heck if we need to do things.
        this.client.application.commands.fetch().then(this.syncCommands.bind(this));
    }
    addCommand(name, command) {
        command.config.name = name;
        this.commands[name] = command;
        if (!command.disabled) {
            this.activeCommands.push(name);
        }
        return command;
    }

    /**
     * This is called when we get all commands.
     * @param {*} discordCommands
     */
    syncCommands(discordCommands) {
        var requested = this.activeCommands.slice();
        var changed = false;
        discordCommands.forEach(discordCommand => {
            let name = discordCommand.name;
            let index = requested.indexOf(name);
            if (index < 0) {
                // Removed from command list.
                console.log("REMOVING command:", name);
                this.client.application.commands.delete(discordCommand).catch(console.error);
                changed = true;
            } else {
                // Remove from requested.
                requested.splice(index, 1);
            }
        });
        // Adding new/missing commands.
        requested.forEach(name => {
            console.log("ADDING command  : ", name);
            this.client.application.commands.create(this.commands[name].config).catch(console.error);
            changed = true;
        });
        if (changed) {
            console.log("Sync complete!");
        }
    }

    handle(interaction) {
        // Set property for text channel names, so others can use this if needed.
        interaction.text_channel_name = this.getChannelName(interaction.channel);
        // Check if command is known and allowed.
        if (!(interaction.commandName in this.commands)) {
            // Not known, So return to user.
            var result = this.returnPrivate('Unknown command...');
        } else if (this.checkBlocked(interaction.commandName, interaction.text_channel_name)) {
            // Not allowed, so return to user.
            var result = this.returnPrivate('Command not available in this channel.');
        } else {
            // Let the handler do it.
            var result = this.commands[interaction.commandName].handler(interaction);
        }
        interaction.reply(result).catch(error => { console.error("Interaction failed?", error) });
    }

    /**
     * Get name of text channel, if it is one.
     */
    getChannelName(channel) {
        // DM or other weirdness.
        if (!channel) {
            return '';
        }
        let name = channel.name;
        // If we are in a thread, we want to the name of the parent channel.
        if (channel.constructor.name == 'ThreadChannel') {
            if (!channel.parent) {
                console.log(channel);
            } else {
                name = channel.parent.name;
            }
        }
        return name;
    }

    checkBlocked(commandName, channelName) {
        if (channelName in wisdomConfig.blocked_commands) {
            let blocked = wisdomConfig.blocked_commands[channelName];
            if (blocked === true) {
                // All commands are blocked in this channel.
                return true;
            } else if (Array.isArray(blocked) && blocked.indexOf(commandName) > -1) {
                // This specific command is blocked in this channel.
                return true;
            }

        }
        return false;
    }

    /**
     * Return message that is only visible to the current user.
     */
    returnPrivate(msg) {
        return {
            "content": msg,
            "ephemeral": true,

        };
    }

    /**
     * Only time we use a direct command.
     * @param {GuildMember} member
     */
    sendWelcome(user) {
        if (!user.bot) {
            user.send(this.commands['help'].getMessage()).catch(error => { console.error("Failed to send welcome to " + user.username, error) });
        }
    }
}

module.exports = Commands;