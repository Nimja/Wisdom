module.exports = function (cmd, env) {
    if (!env.isAdmin || cmd.rest.length < 1) {
        return;
    }
    var matches = cmd.rest.match(/^[^\w]*([\w]+)\s*(.*)$/);
    if (matches === null) {
        return;
    }
    var channel = matches[1];
    var message = matches[2];
    var target = env.client.channels.find('name', channel);
    if (target) {
        target.send(message);
    }
};
