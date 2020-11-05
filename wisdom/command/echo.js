module.exports = function (cmd, env) {
    if (!env.isAdmin || cmd.rest.length < 1) {
        return;
    }
    env.defaultChannel.send(cmd.rest);
};
