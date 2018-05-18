/**
 * Split string into parts, cleaned and ready to be chosen from.
 *
 * @param {String} message
 * @returns {Array}
 */
function splitQuestion(message) {
    // Get rid of trailing question marks.
    var string = message.replace(/[\?\!\.]+$/,'');
    // First, split by commas.
    var parts = string.split(/,+/gi);
    // Get the last one and split by or.
    var last = parts.pop();
    var endParts = last.split(/[^a-z]or[^a-z]/gi);
    // Add those back on.
    parts = parts.concat(endParts);
    // Filter out empty values (like 2 commas with a space).
    var result = [];
    for (var i = 0; i < parts.length; i++) {
        var cur = parts[i].trim();
        if (cur.length > 0) {
            result.push(cur);
        }
    }
    return result;
}

module.exports = function (cmd, env) {
    var options = splitQuestion(cmd.rest);
    if (options.length < 2) {
        return;
    }
    var name = env.user.username;
    var answer = options[Math.floor(Math.random() * options.length)].toString().trim();
    env.channel.send("_" + name + "_ - I choose: " + answer);
};
