import Component from "./Component";

export default class CRect extends Component {
    constructor() {
        super()
        this.visible = true;
        this._backgroundColor = 'black';
        this.isCRect = true;

        this.props = this.props.concat(['backgroundColor'])
    }

    set backgroundColor(color) {
        this._backgroundColor = color;
    }
    Start() {
        this.loaded = true;
        this._onload()
    }

    Update() {
        if(this.visible && this.loaded) {
            this.context.fillStyle = this._backgroundColor;
            this.context.rect(this._x, this._y, this._width, this._height);
            this.context.fill()
        }
    }

    End() {}
}