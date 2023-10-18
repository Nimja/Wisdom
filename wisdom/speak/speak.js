var isNode = typeof (window) === "undefined" && typeof (global) !== "undefined";

var SpeakDict = require('./dict.js'); // NODEONLY

class Speak {
    constructor() {
        this.dicts = {};
        this.commands = [];
        this.init();
    }
    /**
     * Dynamically load json files from dicts, but only if we're on nodeJs.
     */
    init() {
        if (isNode) {
            var dicts = this.dicts;
            var commands = this.commands;
            const fs = require('fs');
            const commandFiles = fs.readdirSync('./wisdom/dicts').filter(file => file.endsWith('.json'));
            for (const file of commandFiles) {
                var baseName = file.substring(0, file.lastIndexOf('.'));
                // Include file.
                var dict = require('../dicts/' + file);
                var speakDict = new SpeakDict(dict);
                if (speakDict.isValid) {
                    dicts[baseName] = speakDict;
                    commands.push(baseName);
                } else {
                    console.error('ERROR: ' + file + ' is missing "sentences" property.');
                }
            }
        }
    }
    /**
     * Return true if we have this command/dictionary.
     *
     * @param {String} dict
     * @returns {Boolean}
     */
    hasDict(dict) {
        return this.dicts.hasOwnProperty(dict);
    }
    /**
     * Construct the sentence.
     * @param {String} dict
     * @param {String} username
     * @returns {String}
     */
    getSentence(dict, username) {
        if (!this.hasDict(dict)) {
            return 'Cannot make sentence...';
        }
        return this.dicts[dict].getSentence(username);
    }
}

module.exports = Speak; // NODEONLY
