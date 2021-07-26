/**
 * Simple package to display the "who" message, as copyright, sort of.
 */
const diceRolls = {
    "b1": ":x: False...", // Binary false.
    "b2": ":white_check_mark: True!", // Binary true.
    // 1 through 9 with 'dots', replaced with the charDot.
    "q1": "     \n  +  \n     ",
    "q2": "+    \n     \n    +",
    "q3": "+    \n  +  \n    +",
    "q4": "+   +\n     \n+   +",
    "q5": "+   +\n  +  \n+   +",
    "q6": "+   +\n+   +\n+   +",
    "q7": "+   +\n+ + +\n+   +",
    "q8": "+ + +\n+   +\n+ + +",
    "q9": "+ + +\n+ + +\n+ + +"
}
const charDot = '●';
const charLine = '┃'; // The left/right side lines.
const charSpacer = ' '; //Space between line and dots.

/**
 * The main export.
 */
module.exports = function (cmd, env) {
    // Important feature for people who think they're clever.
    if (cmd.rest && cmd.rest.toLowerCase().trim().substr(0, 4) === 'over') {
        env.channel.send("Only for Nimja.");
        return;
    }
    // Get max
    let max = getMax(cmd.rest);
    // Get current value.
    let current = Math.floor(Math.random() * max) + 1;
    // Get the resulting message.
    let message = (max == 2) ? rollBinary(current) : rollNormal(current,  max);
    // Send to channel.
    env.channel.send(message);
};

/**
 * Get maximum roll value, based on input.
 *
 * @param {String} rest
 * @returns {Number} Result is from 2 to infinity.
 */
function getMax(rest) {
    let max = 6;
    if (rest) {
        let possibleMax = parseInt(rest.split(/\s/)[0]);
        if (!isNaN(possibleMax) && possibleMax > 1) {
            max = possibleMax;
        }
    }
    return max;
}

/**
 * Simple binary result (true/false).
 *
 * @param {Number} current
 * @returns
 */
function rollBinary(current) {
    return "Rolling binary... " + diceRolls['b' + current];
}

/**
 * Normal result, with pretty dice for max < 9.
 *
 * @param {Number} current
 * @returns
 */
function rollNormal(current, max) {
    let message = "Rolling a d" + max + "... " + current;
    if (current === max) {
        message += '!';
    }
    if (max < 10) {
        message += getPrettyDice(current);
    }
    return message;
}

/**
 * Render a fancy face of a die.
 *
 * @param {Number} current
 * @returns
 */
function getPrettyDice(current) {
    let lChar = charLine + charSpacer;
    let rChar = charSpacer + charLine;
    let curDie = diceRolls['q' + current].replace(/\+/g, charDot).split(/\n/);
    return "\n```" + lChar + curDie.join(rChar + "\n" + lChar) + rChar + "```";
}