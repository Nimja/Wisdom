var SpamFilter = function (timeout) {
    this.timeout = parseInt(timeout);
    this.timestamps = {};
};
module.exports = SpamFilter;
SpamFilter.prototype = {
    /**
     * Warn user if they've tried again too quickly.
     *
     * @param {type} user
     * @returns {Boolean}
     */
    isSpam: function(user) {
        // Check for spamming (with a timeout per userId).
        var timeout = this.getTimeout(user.id);
        if (timeout > 0) {
            user.send("Patience, " + user.username + "... " + timeout + " more seconds. In private is fine though.");
            return true;
        }
        return false;
    },
    /**
     * Get timeout in seconds, if previous command was less than timeout ago.
     *
     * @param {String} userId
     * @returns {Number}
     */
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
