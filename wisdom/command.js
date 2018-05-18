var Command = function (prefix, speak) {
    this.functions = {};
    this.prefix = prefix;
    this.speak = speak;
    this.commands = [];
    this.init();
};

module.exports = Command;

Command.prototype = {
    /**
     * Dynamically load json files from dicts, but only if we're on nodeJs.
     */
    init: function () {
        const fs = require('fs');
        var functions = this.functions;
        var commands = this.commands;
        fs.readdirSync('wisdom/command').forEach(file => {
            var dot = file.lastIndexOf('.');
            var extension = file.substr(dot + 1);
            var baseName = file.substr(0, dot);
            if (extension !== 'js') {
                console.error('ERROR: ' + file + ' not JS file!');
                return;
            }
            commands.push(baseName);
            functions[baseName] = require('./command/' + file);
        });
    },
    /**
     * Get command/rest from message.
     *
     * @param {String} message
     * @returns {Object|Boolean}
     */
    getCommand: function (message) {
        // Only act on commands starting with the prefix (default: !).
        if (message.substring(0, 1) !== this.prefix) {
            return false;
        }
        // Split message between command and rest.
        var matches = message.match(/^[^\w]*([\w]+)\s*(.*)$/);
        if (matches === null) {
            return false;
        }
        var cmd = matches[1].toString().toLowerCase();
        var rest = matches[2];
        if (!this.hasCommand(cmd) && !this.speak.hasDict(cmd)) {
            return false;
        }
        return {command: cmd, rest: rest.toString().trim()};
    },
    /**
     * Execute a single command.
     *
     * @param {Object} cmd
     * @param {Object} env
     */
    execute: function (cmd, env) {
        if (this.hasCommand(cmd.command)) {
            this.functions[cmd.command](cmd, env);
        } else if (this.speak.hasDict(cmd.command)) {
            var message = this.speak.getSentence(cmd.command, env.user.username);
            env.channel.send(message);
        }
    },
    /**
     *
     * @param {type} cmd
     * @returns {Boolean}
     */
    hasCommand: function (cmd) {
        return this.functions.hasOwnProperty(cmd);
    }
};
