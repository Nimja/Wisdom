/**
 * Simple package to display the "who" message, as copyright, sort of.
 */
var package = require('./../../package.json');
module.exports = function (cmd, env) {
    // Pretty formatting.
    var pretty = {embed: {
            color: 4215449,
            title: "I have been created by " + package.author,
            description: "Please be nice with me.\n\n`!intro` - To see some commands.",
        }};
    //Basic formatting.
    var basic = package.name + ' v'
            + package.version + ' - '
            + package.description
            + "\n\nUrl: " + package.homepage;
    env.channel.send(basic, pretty);
};
