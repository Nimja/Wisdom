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
    update: function(channel) {
        if (this.channels.indexOf(channel.name) < 0) {
            return;
        }
        this.channel = channel;
        if (this.timeouts.hasOwnProperty(channel.id)) {
            clearTimeout(this.timeouts[channel.id]);
        }
        this.timeouts[channel.id] = setTimeout(this.sendIdle.bind(this, channel), 1000 * this.timeout);
    },
    sendIdle: function(channel) {
        channel.sendMessage(this.speak.getSentence('idle', 'Nobody'));
    }
};
