import Component from "./Component";

export default class CText extends Component {

    constructor(text) {
        super()
        this._content = text;
        this._textAlign = "left";
        this._textAlignVertical = "top";
        this._fontSize = 12;
        this._fontFamily = "Arial";
        this._color = 'black';

        this.visible = true;
        
        this.calculate_x = 0;
        this.calculate_y = 0;

        this.isCText = true;

        this.props = this.props.concat(['content', 'textAlign', 'textAlignVertical', 'fontSize', 'fontFamily', 'color'])
    }

    set content(v) {
        this._content = v;
    }

    set textAlign(v) {
        this._textAlign = v;
    }

    set textAlignVertical(v) {
        this._textAlignVertical = v;
    }

    set fontSize(v) {
        this._fontSize = v;
    }

    set fontFamily(v) {
        this._fontFamily = v;
    }

    set color(v) {
        this._color = v;
    }

    Start() {
        this.loaded = true;
        this._onload()
    }

    calculate() {
        this.calculate_font = this._fontSize +"px " + this._fontFamily;
        this.calculate_height = this._fontSize + 2;
        this.calculate_width = this.context.measureText(this._content).width;
        
        switch (this._textAlign) {
            case 'left':
                this.calculate_x = this._x;
                break;
            case 'right':
                this.calculate_x = this._x + this._width - this.calculate_width;
                break;
            case 'center':
                this.calculate_x = this._x + (this._width - this.calculate_width) /2;
                break;
            default:
                this.calculate_x = this._x;
                break;
        }
        switch (this._textAlignVertical) {
            case 'top':
                this.calculate_y = this._y + this.calculate_height / 2;
                break;
            case 'bottom':
                this.calculate_y = this._y + (this._height - this.calculate_height / 2)
                break;
            case 'center':
                this.calculate_y = this._y + this._height / 2 + this.calculate_height / 2;
                break;
            default:
                this.calculate_y = this._y;
                break;
        }
    }

    Update() {
        if(this.visible && this.loaded && this._content) {
            this.calculate();
            this.context.font = this.calculate_font;
            this.context.fillStyle = this._color;
            this.context.fillText(this._content, this.calculate_x, this.calculate_y);
        }
    }

    End() {

    } 
}