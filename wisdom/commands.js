const fs = require('fs');
const wisdomConfig = require('../config.json');

class Commands {
    constructor(client) {
        this.client = client;
        this.commands = {};
        this.activeCommands = [];
        this.commandTimeouts = {};
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

    init() {
        // Load commands so the handling is available.
        this.loadCommands();
    }
    addCommand(name, command) {
        command.config.name = name;
        this.commands[name] = command;
        if (!command.disabled) {
            this.activeCommands.push(name);
        }
        return command;
    }

    handle(interaction) {
        // Set property for text channel names, so others can use this if needed.
        interaction.text_channel_name = this.getChannelName(interaction.channel);
        let isDm = !interaction.channel ? true : interaction.channel.isDMBased();
        let result = false;
        // Check if command is known and allowed.
        if (!(interaction.commandName in this.commands)) {
            // Not known, So return to user.
            result = this.returnPrivate('Unknown command...');
        } else if (this.checkBlocked(interaction.commandName, interaction.text_channel_name)) {
            // Not allowed, so return to user.
            result = this.returnPrivate('Command not available in this channel.');
        } else {
            // Check timeout on command.
            if (!isDm) {
                result = this.checkTimeout(interaction.commandName, interaction.user.id);
            }

            if (!result) {
                // Let the handler do it.
                result = this.commands[interaction.commandName].handler(interaction);
            }
        }
        if (!!result) {
            interaction.reply(result).catch(error => { console.error("Interaction failed?", error) });
        }
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

    checkTimeout(commandName, userId) {
        let ts = Math.floor(Date.now() / 1000);
        let toRemove = [];
        // Get expired keys.
        for (let i in this.commandTimeouts) {
            if (this.commandTimeouts[i] <= ts) {
                toRemove.push(i);
            }
        }
        // Clear.
        for (let i of toRemove) {
            delete this.commandTimeouts[i];
        }
        // Command is not tracked.
        if (commandName in wisdomConfig.command_timeouts === false) {
            return false;
        }
        // Set the key.
        let key = commandName + "." + userId.toString();
        // User is in timeout.
        if (key in this.commandTimeouts) {
            let seconds = this.commandTimeouts[key] - ts;
            let msg = "You have to wait " + this.formatTime(seconds) + " until you can use that command again.";
            return this.returnPrivate(msg);
        }
        // Set a new timeout for this command/user.
        this.commandTimeouts[key] = ts + wisdomConfig.command_timeouts[commandName];
        return false;
    }

    formatTime(seconds) {
        let result = [];
        let hours = Math.floor(seconds / 3600);
        if (hours > 0) {
            seconds -= hours * 3600;
            result.push(hours + "h");
        }
        let minutes = Math.floor(seconds / 60);
        if (hours > 0 || minutes > 0) {
            seconds -= minutes * 60;
            result.push(minutes + "m");
        }
        result.push(seconds + "s");
        return result.join("");
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