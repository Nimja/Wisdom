/**
 * Simple package to display the "who" message, as copyright, sort of.
 */
var package = require('./../../package.json');
module.exports = function (cmd, env) {
    if (env.isDm) {
        // Pretty formatting.
        var message = {embed: {
                color: 4215449,
                title: "Hello, I am " + package.name,
                fields: [
                    {name: "Version", value: package.version},
                    {name: "Description", value: package.description},
                    {name: "Author", value: package.author},
                    {name: "Url", value: package.homepage}
                ]
            }};
    } else {
        //Basic formatting.
        var message = package.name + ' v'
                + package.version + ' - '
                + package.description
                + "\n\nUrl: " + package.homepage;
    }
    env.channel.send(message);
};
