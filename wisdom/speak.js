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
    init: function () {
        if (isNode) {
            const fs = require('fs');
            var dicts = this.dicts;
            var commands = this.commands;
            fs.readdirSync('wisdom/dicts').forEach(file => {
                var baseName = file.replace(/\.[^/.]+$/, "");
                dicts[baseName] = require('./dicts/' + file);
                commands.push(baseName);
            });
        }
    },
    hasDict: function (dict) {
        return this.dicts.hasOwnProperty(dict);
    },
    getRandom: function (arr) {
        return Array.isArray(arr) ? arr[Math.floor(Math.random() * arr.length)] : arr;
    },
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
    getSentence: function (dict, username) {
        if (!this.hasDict(dict)) {
            return 'Cannot make sentence...';
        }
        var data = this.dicts[dict];
        var sentence = this.getPart(data.sentences);
        for (var index in data) {
            if (index === "sentences") {
                continue;
            }
            var name = index.toUpperCase();
            var value = this.getPart(data[index]);
            sentence = sentence.replace(new RegExp(name, 'g'), value);
        }
        sentence = sentence.replace(new RegExp('NAME', 'g'), username);
        sentence = sentence.replace(
                /(\^.)/g,
                function (a) {
                    return a[1].toString().toUpperCase();
                }
        );
        return sentence;
    }
};
