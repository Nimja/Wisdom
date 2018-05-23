var message = require('./../data/intro.json');

module.exports = function (cmd, env) {
    env.user.send(message.text, message);
};
