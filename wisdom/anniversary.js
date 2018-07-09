// Load the speak packages.
var fs = require("fs");
var messages = require('./data/anniversary_texts.json');

var Anniversary = function (client) {
    this.client = client;
    this.channel = null;
};

module.exports = Anniversary;

Anniversary.prototype = {
    /**
     * Call out people who have their anniversary.
     */
    callout: function () {
        var anniversaries = this.getAnniversaries();
        var channel = this.channel;
        var guild = channel.guild;
        for (var index in anniversaries) {
            var anniversary = anniversaries[index];
            // We fetch users via the channel.guild so that we don't announce people who are no longer in the guild.
            guild.fetchMember(anniversary.id, false)
                    .then((member) => {
                        var user = member.user;
                        var year = anniversary.age > 1 ? ' years' : ' year';
                        var message = getMessage(user.toString(), anniversary.age, year);
                        channel.send(message);
                    })
                    .catch((error) => {
                        console.log(error);
                    }
                    ); // Do nothing in case it's not found/invalid.
            break;
        }
    },
    /**
     * Get anniversaries with userId and age.
     * @returns {Array}
     */
    getAnniversaries: function () {
        var data = JSON.parse(fs.readFileSync('wisdom/data/anniversaries.json'));
        var curDate = new Date();
        var result = [];
        for (var index in data) {
            var row = data[index],
                    date = new Date(row.date),
                    age = curDate.getYear() - date.getYear();
            if (age > 0 && date.getMonth() === curDate.getMonth() && date.getDate() === curDate.getDate()) {
                result.push({id: row.id, age: age});
            }
        }
        return result;
    },
    init: function (channel) {
        this.channel = channel;
    }
};

/**
 * Get (random) message for anniversary.
 * @param {String} user
 * @param {Number} number
 * @param {String} year
 * @returns {String}
 */
function getMessage(user, number, year)
{
    var message = messages[Math.floor(Math.random() * messages.length)];
    var map = {USER: user, NUMBER: number, YEAR: year};
    var re = new RegExp(Object.keys(map).join("|"), "g");
    var parsed = message.replace(re, function (matched) {
        return map[matched];
    });
    return parsed;
}