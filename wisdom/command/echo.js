module.exports = function (cmd, env) {
    if (env.defaultChannel && env.isAdmin && cmd.rest.length > 0) {
        env.defaultChannel.send(cmd.rest);
    }
};
