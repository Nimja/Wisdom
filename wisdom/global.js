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
        if (key in Global.data) {
            return Global.data[key];

        }
        return null;
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