// Load the speak packages.
var fs = require("fs");

var Anniversary = function (client) {
    this.client = client;
    this.channel = null;
};

module.exports = Anniversary;

Anniversary.prototype = {
    callout: function () {
        var anniversaries = this.getAnniversaries();
        var channel = this.channel;
        for (var index in anniversaries) {
            var anniversary = anniversaries[index];
            this.client.fetchUser(anniversary.id).then(function (user) {
                var year =  anniversary.age > 1 ? ' years' : ' year';
                channel.send(user.toString() + " has been supporting me for " + anniversary.age + year + ', today! Thank you so much!');
            });
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
            if (date.getMonth() === curDate.getMonth() && date.getDate() === curDate.getDate()) {
                result.push({id: row.id, age: age});
            }
        }
        return result;
    },
    init: function(channel) {
        this.channel = channel;
    }
};
