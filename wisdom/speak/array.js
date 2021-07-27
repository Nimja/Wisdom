class SpeakArray {
    constructor(item) {
        this.index = 0;
        this.item = item;
        this.shuffleArray();
    }
    /**
     * SpeakArray will shuffle an array and go over it one by one.
     *
     * Once you reach the end, it will shuffle again and start over.
     *
     * This ensures we have a fair bit of randomness, though a small chance of repeats
     * if the item was in the last position and then first position after the next shuffle.
     */
    /**
     * Get next item in array, after shuffle.
     */
    getNext() {
        let result = this.item[this.index];
        this.index++;
        if (this.index >= this.item.length) {
            this.shuffleArray();
        }
        return result;
    }
    /**
     * SpeakArray will shuffle an array and go over it one by one.
     *
     * Once you reach the end, it will shuffle again and start over.
     *
     * This ensures we have a fair bit of randomness, though a small chance of repeats
     * if the item was in the last position and then first position after the next shuffle.
     */
    /**
     * Shuffle array and reset index.
     */
    shuffleArray() {
        let array = this.item;
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        this.index = 0;
    }
}

module.exports = SpeakArray; // NODEONLY