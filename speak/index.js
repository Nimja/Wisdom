var isNode = typeof (window) === "undefined" && typeof (navigator) === "undefined";

var Speak = function () {
    this.dicts = {};
    this.init();
};

Speak.prototype = {
    init: function () {
        if (isNode) {
            const fs = require('fs');
            var dicts = this.dicts;
            fs.readdirSync('speak/dicts').forEach(file => {
                var baseName = file.replace(/\.[^/.]+$/, "");
                dicts[baseName] = require('./dicts/' + file);
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
        var random = this.getRandom(parts);
        if (Array.isArray(random)) {
            var result = [];
            for (var index in random) {
                result.push(this.getPart(random[index]));
            }
            return result.join(' ');
        } else {
            return random;
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


if (isNode) {
    module.exports = Speak;
}