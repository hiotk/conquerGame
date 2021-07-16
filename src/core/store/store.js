export default class Store {
    constructor() {
        this.state = {};
        this.prefix = "game-store:"
        this.allKeys = [];
        this.loaded = false;
        this.deltaTime = 3*1000;
        this.units = [];
    }
    load() {
        this.restore();
        this.loaded = true;
    }
    persist() {
        if(this.loaded == false) return;
        const prefix = this.prefix;
        const allKeys = [];
        Object.keys(this.state).forEach(key=>{
            const unitValue = JSON.stringify(this.state[key]);
            const unitKey = prefix + key;
            allKeys.push(unitKey);
            localStorage.setItem(unitKey, unitValue);
        })
        localStorage.setItem(prefix+"store:allKeys", JSON.stringify(allKeys))
    }
    restore() {
        const prefix = this.prefix;
        const allKeys = JSON.parse(localStorage.getItem(prefix+"store:allKeys") || "[]");
        allKeys.forEach(key=>{
            const value = localStorage.getItem(key);
            if(value!=null && key.indexOf(prefix)===0) {
                const unitKey = key.replace(prefix,"");
                const unitValue = JSON.parse(value);
                this.state[unitKey] = unitValue;
            }
        })
    }
    getState(key) {
        return this.state[key];
    }
    setState(key, state) {
        this.state[key] = state;
    }
    getUnit(key) {
        return this.units[key];
    }
    setUnit(key, value) {
        this.units[key] = value;
    }
    dispatch({ type = 'unit/update', payload = {}}) {
        const types = type.split('/');
        const unitName = types[0];
        const unitAction = types[1];

        if(this.units[unitName]) {
            this.units[unitName][unitAction]({ type, payload })
        }
    }
}
