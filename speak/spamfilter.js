var SpamFilter = function (timeout) {
    this.timeout = parseInt(timeout);
    this.timestamps = {};
};
module.exports = SpamFilter;
SpamFilter.prototype = {
    getTimeout: function(userId) {
        var timestamp = Math.floor(Date.now() / 1000);
        var cur = 0;
        if (this.timestamps.hasOwnProperty(userId)) {
            cur = this.timestamps[userId] - timestamp;
        }
        if (cur > 0) {
            return cur;
        }
        this.timestamps[userId] = timestamp + this.timeout;
        return 0;
    }
};
