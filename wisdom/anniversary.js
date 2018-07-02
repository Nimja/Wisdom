// Load the speak packages.
var fs = require("fs");

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
                    channel.send(user.toString() + " has been supporting me for " + anniversary.age + year + ', today! Thank you so much!');
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
    getAnniversaries: function() {
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
    init: function(channel) {
        this.channel = channel;
    }
};
