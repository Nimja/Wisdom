var fs = require("fs");
var messages = require('./data/anniversary_texts.json');

class Anniversary {
    constructor(client, channel) {
        this.client = client;
        this.channel = channel;
    }
    /**
     * Call out people who have their anniversary.
     */
    callout() {
        var anniversaries = this.getAnniversaries();
        for (var index in anniversaries) {
            this.celebrateAnniversary(this.channel, anniversaries[index]);
        }
    }
    /**
     * Get anniversaries with userId and age.
     * @returns {Array}
     */
    getAnniversaries() {
        var data = JSON.parse(fs.readFileSync('wisdom/data/anniversaries.json'));
        var curDate = new Date();
        var result = [];
        for (var index in data) {
            var row = data[index], date = new Date(row.date), age = curDate.getYear() - date.getYear();
            if (age > 0 && date.getMonth() === curDate.getMonth() && date.getDate() === curDate.getDate()) {
                result.push({ id: row.id, age: age });
            }
        }
        return result;
    }
    /**
     * Celebrate anniversary for single user.
     *
     * @param {type} channel
     * @param {Object} anniversary
     */
    celebrateAnniversary(channel, anniversary) {
        var guild = channel.guild;
        // We fetch users via the guild so that we don't announce people who are no longer in the guild.
        guild.members.fetch(anniversary.id).then(
            member => {
                if (member._roles.length < 1) {
                    // Skip members without roles (who left but aren't removed).
                    return;
                }
                var user = member.user;
                var year = anniversary.age > 1 ? 'years' : 'year';
                var message = this.getMessage(user.toString(), anniversary.age, year);
                channel.send(message);
            }
        ).catch(error => { });
    }
    /**
     * Get (random) message for anniversary.
     * @param {String} user
     * @param {Number} number
     * @param {String} year
     * @returns {String}
     */
    getMessage(user, number, year) {
        var message = messages[Math.floor(Math.random() * messages.length)];
        var map = { USER: user, NUMBER: number, YEAR: year };
        var re = new RegExp(Object.keys(map).join("|"), "g");
        var parsed = message.replace(re, function (matched) {
            return map[matched];
        });
        return parsed;
    }
}

module.exports = Anniversary;
