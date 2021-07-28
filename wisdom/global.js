class Global {

    constructor() {
        if (!Global.data) {
            Global.data = { init: true };
        }
    }

    /**
     * Get data item by key.
     * @param {string} key
     * @returns {any}
     */
    getData(key) {
        return Global.data[key];
    }
    /**
     * Set data item by key.
     * @param {string} key
     * @param {any} value
     * @returns
     */
    setData(key, value) {
        Global.data[key] = value;
        return this;
    }

}

module.exports = Global;