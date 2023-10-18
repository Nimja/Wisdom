const { REST, Routes } = require('discord.js');
const Commands = require('../wisdom/commands.js');


class SyncCommands {
    constructor(config) {
        this.config = config;
        this.global_commands = [];
        this.guild_commands = [];
    }
    async run() {
        const commands = new Commands({});
        commands.loadCommands();
        let global_commands = [];
        let guild_commands = [];

        // Split commands into global and guild.
        for (let i in commands.commands) {
            let command = commands.commands[i];
            if (!!command.disabled) {
                continue;
            }
            if (!!command.guild) {
                guild_commands.push(command.config);
            } else {
                global_commands.push(command.config);
            }
        }

        // Construct and prepare an instance of the REST module
        const rest = new REST().setToken(this.config.token);
        await this.runSync(rest, guild_commands, true);
        await this.runSync(rest, global_commands, false);

    }
    addCommand(name, command) {
        console.log(name);
    }

    async runSync(rest, commands, is_guild = false) {
        // The put method is used to fully refresh all commands in the guild with the current set
        let url = '';
        if (is_guild) {
            url = Routes.applicationGuildCommands(this.config.bot_user_id, this.config.guild_id);
        } else {
            url = Routes.applicationCommands(this.config.bot_user_id);
        }

        const data = await rest.put(url, { body: commands });
        const message = is_guild ? "GUILD" : "GLOBAL";
        console.log(`Successfully reloaded ${data.length} ${message} (/) commands.`);
    }
}

module.exports = SyncCommands;