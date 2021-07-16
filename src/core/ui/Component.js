import EventEmitter from 'events'
import Scene from '../scenes/scene';

export default class Component {
    constructor() {
        this._name = '';
        this._x = 0;
        this._y = 0;
        this._width = 100;
        this._height = 30;
        this._zIndex = 0;
        this._ontouchstart = ()=> {}
        this._ontouchmove = ()=> {}
        this._ontouchend = () => {}
        this._onload = ()=>{}

        this.visible = false; // 基础组件默认不展示
        this.loaded = false; // 组件默认处于未加载状态
        this.touchable = false; // 组件是否接受触屏事件
        this.touched = false; // 是否触摸到组件
        this.eventEmitter = new EventEmitter(); // 事件触发器
        this.eventEmitter.setMaxListeners(3000);
        this.isComponent = true;
        this.props = ['name', 'x','y', 'width', 'height', 'ontouchstart', 'ontouchmove', 'ontouchend', 'onload', 'zIndex']

        this.index = Component.Index++;
    }

    static Index = 0;

    set name(v) {
        this._name = v;
    }

    set x(v) {
        this._x = v;
    }

    set y(v) {
        this._y = v;
    }

    set width(v) {
        this._width = v;
    }

    set height(v) {
        this._height = v;
    }

    set zIndex(v) {
        this._zIndex = v;
    }

    set ontouchstart(func) {
        this._ontouchstart = func;
    }

    set ontouchmove(func) {
        this._ontouchmove = func;
    }

    set ontouchend(func) {
        this._ontouchend = func;
    }

    set onload(func) {
        this._onload = func;
    }

    Start() {

    }
    Update() {

    }
    End() {

    }


    setTouchable(touchable) {
        this.touchable = touchable;
        if(this.parent && touchable && this.parent.setTouchable) this.parent.setTouchable(touchable);
    }

    /**
     * 判断是否在组件内部
     * @param {object} position 
     * @param {number} position.x
     * @param {number} position.y 
     */
    isScope({ x, y }) {
        return x >= this._x && x <= (this._x + this._width) && y >= this._y && y <= (this._y + this._height);
    }
    /**
     * 添加事件
     * @param {string} type 
     * @param {function} listener 
     */
    addEventListener(type, listener) {
        if(this.touchable) {
            this.eventEmitter.on(type, listener);
        }
    }
    /**
     * 移除事件
     * @param {string} type 
     * @param {function} listener 
     */
    removeEventListener(type, listener) {
        if(this.touchable) {
            this.eventEmitter.removeListener(type, listener)
        }
    }
    /**
     * 触发TouchMove事件
     * @param {Event} evt 
     */
    emitTouchMove(evt) {
        if(this.touchable) {
            this.eventEmitter.emit('touchmove', evt);
            console.log('component', 'touchmove', evt)
            this._ontouchmove(evt);
        }
    }
    /**
     * 触发TouchStart事件
     * @param {Event} evt 
     */
    emitTouchStart(evt) {
        if(this.touchable) {
            this.touched = true;
            this.eventEmitter.emit('touchstart', evt);
            console.log('component', 'touchstart', evt);
            this._ontouchstart(evt);
        }
    }
    /**
     * 触发TouchEnd事件
     * @param {Event} evt 
     */
    emitTouchEnd(evt) {
        if(this.touchable) {
            this.touched = false;
            this.eventEmitter.emit('touchend', evt);
            console.log('component', 'touchend', evt);
            this._ontouchend(evt);
        }
    }
}