class Global {

    constructor() {
        if (!Global.data) {
            Global.data = { init: true };
        }
    }

    getData(key) {
        return Global.data[key];
    }
    setData(key, value) {
        Global.data[key] = value;
        return this;
    }

}

module.exports = Global;