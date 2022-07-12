const KEY_SENTENCES = 'sentences';

const SpeakArray = require('./array.js'); // NODEONLY

class SpeakDict {
    constructor(dict) {
        this.isValid = dict.hasOwnProperty(KEY_SENTENCES);
        this.dict = this.prepareStructure(dict);
    }
    /**
     * Speak dicts have the following structure
     *
     * Dictionary:
     * level 0 - Random item: Key name that becomes variable and "sentences"
     * Level 1 - Order is kept, as it implies part of a sentence.
     * Level 2 - Pick random item.
     */
    prepareStructure(dict) {
        for (let key in dict) {
            // Level 0, always random.
            let level0 = dict[key];
            for (let i0 in level0) {
                // Level 1, keep order.
                let level1 = level0[i0];
                if (Array.isArray(level1)) {
                    for (let i1 in level1) {
                        let level2 = level1[i1];
                        // Level 2, random.
                        if (Array.isArray(level2)) {
                            level1[i1] = new SpeakArray(level2);
                        }
                    }
                }
            }
            // Level 0, we get a random item.
            dict[key] = new SpeakArray(level0);
        }
        return dict;
    }
    getNextForKey(key) {
        // Level 0, get random.
        let level0 = this.dict[key].getNext();
        if (Array.isArray(level0)) {
            let result = [];
            // Level 1.
            for (let i0 in level0) {
                let level1 = level0[i0];
                if (level1 instanceof SpeakArray) {
                    // Pick random item from level 2.
                    result.push(level1.getNext());
                } else {
                    result.push(level1);
                }
            }
            // Join the result, replacing whitespace with a single space.
            return result.join(' ').replace(/\s+([.,?!])/g, '$1').replace(/\s{2,}/g, ' ');
        } else {
            return level0;
        }
    }
    /**
     * Get a sentence, based on the different levels.
     *
     * @param {String} username
     * @return {String}
     */
    getSentence(username) {
        var t = this;
        var sentence = this.getNextForKey(KEY_SENTENCES);
        let buffer = {
            'NAME': username,
            'SENTENCES': 'SENTENCES',
        };
        // Do 2 passes of replacing the variables, to allow for 1 level of recursion.
        for (var i = 0; i < 2; i++) {
            // Replace all CAPITALIZED words (of at least 2 letters) with the content (if needed).
            sentence = sentence.replace(/([A-Z]{2,})/g, function (phrase) {
                // If we don't have it in the buffer, add it.
                if (!buffer.hasOwnProperty(phrase)) {
                    let lphrase = phrase.toLowerCase();
                    // If it is part of the dictionary, get the next value.
                    buffer[phrase] = t.dict.hasOwnProperty(lphrase) ? t.getNextForKey(lphrase) : phrase;
                }
                return buffer[phrase];
            });
        }
        // Capitalize the next letter after ^letter.
        sentence = sentence.replace(
            /(\^.)/g,
            function (a) {
                return a[1].toString().toUpperCase();
            }
        );
        return sentence;
    }
}

module.exports = SpeakDict; // NODEONLY