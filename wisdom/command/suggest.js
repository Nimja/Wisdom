const responses = [
    'Okay.',
    'Okay.',
    'Okay...',
    'Okay...',
    'Thank you.',
    'Thank you.',
    'Thank you.',
    'I\'ve noted it down.',
    'Alright, I will pass it on.',
    'Go it.',
    'Alright.',
    'Yes.',
    'Interesting...'
];

function quote(text) {
    let separator = "\n> ";
    return separator + text.split("\n").join(separator);
}

module.exports = function (cmd, env) {
    let rest = cmd.rest;
    if (rest.length < 1) {
        return; // Nothing else was said.
    }
    env.reportUser.send("Suggestion: " + quote(rest));
    let message = responses[Math.floor(Math.random() * responses.length)];
    console.log(message);
    env.channel.send(message);
};
