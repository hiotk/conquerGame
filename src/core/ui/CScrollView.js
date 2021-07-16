import CLayout from "./CLayout";
import Component from "./Component";

/**
 * 比较值，返回范围内的正常值
 * @param {number} value 待比较的值
 * @param {number} min 范围最小值
 * @param {number} max 范围最大值
 */
export const MathRange = (value, min, max)=>{
    if(value<min) return min;
    if(value>max) return max;
    return value;
}

export default class ScrollView extends Component {
    constructor() {
        super();
        this._content = new CLayout();
        this._scrollTop = 0;
        this._scrollLeft = 0;
        this.prevScrollTop = 0;
        this.prevScrollLeft = 0;
        this.dx = 0;
        this.dy = 0;
        this.isTouch = false;
        this.startPosition = {
            x: 0,
            y:0
        }
        this.currentPosition = {
            x: 0,
            y:0
        }
    }
    set content(content) {
        this._content = content;
    }
    set scrollTop(v) {
        this._scrollTop = v;
    }
    set scrollLeft(v) {
        this._scrollLeft = v;
    }
    Start() {
        this.loaded = true;
        this._onload();
    }
    Update() {
        this._content.x = this._x + this._scrollTop;
        this._content.y = this._y + this._scrollLeft;
        this._content.Update();
    }
    _ontouchstart(evt) {
        this.isTouch = true;
        this.startPosition = { x: evt.pageX, y: evt.pageY };
        this.dx = 0;
        this.dy = 0;
        this.prevScrollTop = this._scrollTop;
        this.prevScrollLeft = this._scrollLeft;
    }
    _ontouchmove(evt) {
        if(this.isTouch) {
            const currentPosition = { x: evt.pageX, y: evt.pageY };
            this.dx = currentPosition.x - this.startPosition.x;
            this.dy = currentPosition.y - this.startPosition.y;
            this._scrollLeft = MathRange(this.prevScrollLeft+this.dx, 0, this._content._width - this._width);
            this._scrollTop = MathRange(this.prevScrollTop + this.dy, 0, this._content._height - this._height);
            this.currentPosition = currentPosition;
        }
    }
    _ontouchend(evt) {
        this.isTouch = false;
        this.startPosition = { x: 0, y: 0 };
        this.dx = 0;
        this.dy = 0;
        this.prevScrollTop = this._scrollTop;
        this.prevScrollLeft = this._scrollLeft;
    }
}