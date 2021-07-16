import CButton from "./CButton";
import EventEmitter from 'events'

export default class CToggleButton extends CButton {
    constructor() {
        super()
        this._toggle = false;
        this._onchange = ()=>{}
        this.props = this.props.concat(['toggle', 'onchange'])
        this.children = [];
    }

    set toggle(v) {
        this._toggle = v;
        this.background = this.children[v?1:0]
    }

    set onchange(func) {
        this._onchange = func;
    }

    Start() {
        this.loaded = true;
        this.addEventListener('touchend', this.onTouchEnd)
        this.background = this.children[this._toggle?1:0]
    }

    setToggle(toggle) {
        this.toggle = toggle;
        this.eventEmitter.emit('change', this._toggle)
        setTimeout(()=> this._onchange(this._toggle), 100);
    }

    onTouchEnd = ()=>{
        this.Toggle()
    }

    Toggle() {
        this.toggle = !this._toggle;
        this.eventEmitter.emit('change', this._toggle)
        setTimeout(()=> this._onchange(this._toggle), 100);
    }
}