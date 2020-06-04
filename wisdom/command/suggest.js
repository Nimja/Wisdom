module.exports = function (cmd, env) {
    var rest = cmd.rest;
    if (rest.length < 1) {
        return; // Nothing else was said.
    }
    env.reportUser.send("Suggestion: " + rest);
};
