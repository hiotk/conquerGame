export default class Unit {
    constructor(name) {
        this.index = Unit.Index ++;
        this.state = {};
        this.store = null;
        this.name = name;
    }
    static Index = 0;
    setStore(store) {
        this.store = store;
    }
    persist() {
        this.store.setUnit(this.name, this);
        this.store.setState(this.name, this.state);
    }
    restore() {
        this.setState(this.store.getUnit(this.name));
    }
    setState(state) {
        const newState = {
            ...this.state,
            ...state
        }
        this.state = newState;
    }
    getState() {
        return this.state;
    }
}