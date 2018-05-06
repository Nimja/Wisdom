var Idle = function (speak, channels, timeout) {
    this.speak = speak;
    this.channels = channels;
    this.timeout = parseInt(timeout);
    if (this.timeout < 60) {
        this.timeout = 60;
    }
    this.timeouts = {};
};
module.exports = Idle;
Idle.prototype = {
    /**
     * Set a timeout for this channel, if we use it.
     *
     * @param {type} channel
     */
    update: function(channel) {
        // Only set idle timers for channels we're monitoring.
        if (this.channels.indexOf(channel.name) < 0) {
            return;
        }
        // Clear the timer we've set for this channel.
        if (this.timeouts.hasOwnProperty(channel.id)) {
            clearTimeout(this.timeouts[channel.id]);
        }
        // Set timer.
        this.timeouts[channel.id] = setTimeout(this.sendIdle.bind(this, channel), 1000 * this.timeout);
    },
    /**
     * Send a message to this channel.
     *
     * @param {type} channel
     */
    sendIdle: function(channel) {
        channel.send(this.speak.getSentence('idle', 'Nobody'));
    }
};
