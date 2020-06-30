var themes = [
    "Aroused",
    "Beautiful",
    "Blank",
    "Brainwashed",
    "Captive",
    "Captured",
    "Challenged",
    "Chased",
    "Conquered",
    "Dazed",
    "Detached",
    "Disarmed",
    "Drugged",
    "Emotionless",
    "Empowered",
    "Empty",
    "Energized",
    "Erased",
    "Erotic",
    "Focused",
    "Helpless",
    "Impersonal",
    "Kidnapped",
    "Meditative",
    "Mind Controlled",
    "Mindless",
    "Naughty",
    "Obedient",
    "Objectified",
    "Outwitted",
    "Passive",
    "Playful",
    "Programmed",
    "Protected",
    "Rebirth",
    "Release",
    "Repurposed",
    "Safe",
    "Seduced",
    "Sensuous",
    "Submissive",
    "Surprised",
    "Taken",
    "Teased",
    "Tempted",
    "Used"
];

let minNum = 2;
let maxNum = 10;

module.exports = function (cmd, env) {
    let num = parseInt(cmd.rest);
    if (isNaN(num)) {
        num = minNum;
    }
    num = Math.min(maxNum, Math.max(minNum, num));
    let theme = getRandom(themes, num);
    env.channel.send("Theme: " + theme.join(" & "));
};

function getRandom(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}