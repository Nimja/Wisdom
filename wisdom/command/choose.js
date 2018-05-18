module.exports = function (cmd, env) {
    var string = cmd.rest.replace(/\?+$/,'');
    var parts = string.split(/\s*,+\s*/gi);
    var last = parts.pop();
    var endParts = last.split(/[^a-z]or[^a-z]/i);
    if (endParts.length > 1) {
        parts = parts.concat(endParts);
    } else {
        parts.push(last);
    }
    if (parts.length < 2) {
        return;
    }
    var name = env.user.username;
    var answer = parts[Math.floor(Math.random() * parts.length)].toString().trim();
    env.channel.send("_" + name + "_ - I choose: " + answer);
};
