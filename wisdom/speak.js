var isNode = typeof (window) === "undefined" && typeof (navigator) === "undefined";

var Speak = function () {
    this.dicts = {};
    this.commands = [];
    this.init();
};

// Export if in nodejs.
if (isNode) {
    module.exports = Speak;
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
            fs.readdirSync('wisdom/dicts').forEach(file => {
                var dot = file.lastIndexOf('.');
                var extension = file.substr(dot + 1);
                var baseName = file.substr(0, dot);
                if (extension !== 'json') {
                    console.log('ERROR: ' + file + ' not JSON file!');
                    return;
                }
                var dict = require('./dicts/' + file);
                if (dict.hasOwnProperty('sentences')) {
                    dicts[baseName] = dict;
                    commands.push(baseName);
                } else {
                    console.log('ERROR: ' + file + ' is missing "sentences" property.');
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
     * Get random element of array, or return a string, if given.
     *
     * @param {String|Array} arr
     * @returns {String|Array}
     */
    getRandom: function (arr) {
        return Array.isArray(arr) ? arr[Math.floor(Math.random() * arr.length)] : arr;
    },
    /**
     * Get a recursive part of the dictionary, this allows for randomness in many paces.
     *
     * @param {type} parts
     * @returns {String|nm$_speak.Speak.prototype.getRandom.arr|Object.prototype.getPart.cur}
     */
    getPart: function (parts) {
        var cur = this.getRandom(parts);
        if (Array.isArray(cur)) {
            var result = [];
            for (var index in cur) {
                var part = this.getPart(cur[index]);
                if (part.length > 0) {
                    result.push(part);
                }
            }
            return result.join(' ');
        } else {
            return cur;
        }
    },
    /**
     * Go from the dict into a resultset with all the values.
     */
    getParts: function(dict) {
        var result = {};
        var data = this.dicts[dict];
        for (var index in data) {
            result[index.toUpperCase()] = this.getPart(data[index]);
        }
        return result;
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
        var parts = this.getParts(dict);
        parts.NAME = username;
        var sentence = parts.SENTENCES;
        console.log(parts);
        // Replace all parts.
        for (var index in parts) {
            sentence = sentence.replace(new RegExp(index, 'g'), parts[index]);
        }
        // Capitalize the next letter after ^letter.
        sentence = sentence.replace(
                /(\^.)/g,
                function (a) {
                    return a[1].toString().toUpperCase();
                }
        );
        return sentence;
    }
};
