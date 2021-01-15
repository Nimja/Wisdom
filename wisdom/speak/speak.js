var isNode = typeof (window) === "undefined" && typeof (navigator) === "undefined";

var Speak = function () {
    this.dicts = {};
    this.commands = [];
    this.init();
};

// Export if in nodejs.
if (isNode) {
    module.exports = Speak;
    var SpeakDict = require('./dict.js');
}

Speak.prototype = {
    /**
     * Dynamically load json files from dicts, but only if we're on nodeJs.
     */
    init: function () {
        if (isNode) {
            const fs = require('fs');
            var dicts = this.dicts;
            var commands = this.commands;
            // Go over contents in dicts dir.
            fs.readdirSync('wisdom/dicts').forEach(file => {
                var dot = file.lastIndexOf('.');
                var extension = file.substr(dot + 1);
                var baseName = file.substr(0, dot);
                // Check extension :)
                if (extension !== 'json') {
                    console.error('ERROR: ' + file + ' not JSON file!');
                    return;
                }
                // Include file.
                var dict = require('../dicts/' + file);
                var speakDict = new SpeakDict(dict)
                if (speakDict.isValid) {
                    dicts[baseName] = speakDict;
                    commands.push(baseName);
                } else {
                    console.error('ERROR: ' + file + ' is missing "sentences" property.');
                }
            });
        }
    },
    /**
     * Return true if we have this command/dictionary.
     *
     * @param {String} dict
     * @returns {Boolean}
     */
    hasDict: function (dict) {
        return this.dicts.hasOwnProperty(dict);
    },
    /**
     * Construct the sentence.
     * @param {String} dict
     * @param {String} username
     * @returns {String}
     */
    getSentence: function (dict, username) {
        if (!this.hasDict(dict)) {
            return 'Cannot make sentence...';
        }
        return this.dicts[dict].getSentence(username);
    }
};
