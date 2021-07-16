import Component from "./Component";
import CRect from "./CRect";
import CText from "./CText";

export default class CButton extends Component {
    constructor() {
        super()

        this._background = new CRect();
        this._content = new CText("");

        this.visible = true;
        this.touchable = true;
        this.isCButton = true;

        this.props = this.props.concat(['background', 'content']);
    }

    set background(v) {
        this._background = v;
    }

    set content(v) {
        this._content = v;
    }

    set x(v) {
        this._x = v;
        this._background.x = v;
        this._content.x = v;
    }

    set y(v) {
        this._y = v;
        this._background.y = v;
        this._content.y = v;
    }

    set width(v) {
        this._width = v;
        this._background.width = v;
        this._content.height = v;
    }

    set height(v) {
        this._height = v;
        this._background.height = v;
        this._content.height = v;
    }

    Start() {
        this.loaded = true;
    }

    Update() {
        if(this.visible && this.loaded) {
            this.updateChildren()
        }
    }

    updateChildren() {
        const children = [ this._background, this._content]
        const visibleChildren = children.filter(child=> child.visible);
        visibleChildren.forEach(child=>{
            if(!child.context) {
                child.parent = this;
                child.context = this.context;
                child.Start()
            }
            else child.Update()
        })
    }

    End() {}
}