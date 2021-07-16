import Component from "./Component";

export default class CLayout extends Component {
    constructor() {
        super()
        this._gutter = { h: 0, v: 0 }
        this._layout = { d: 'h', h: 'center', v: 'center' }
        this.props = this.props.concat(['gutter', 'layout']);

        this.visible = true;
        this.children = [];

        this._ontouchstart = (...props)=>{
            this.children.forEach(child=>{
                child.emitTouchStart(...props)
            })
        }
        this._ontouchmove = (...props)=>{
            this.children.forEach(child=>{
                child.emitTouchMove(...props)
            })
        }
        this._ontouchend = (...props)=>{
            this.children.forEach(child=>{
                child.emitTouchEnd(...props)
            })
        }
    }

    set layout({ d, h, v}) {
        this._layout = { d, h, v };
    }

    set gutter({ h, v}) {
        this._gutter = { h, v };
    }

    Start() {
        this.loaded = true;
        this._onload();
    }

    Update() {
        if(this.visible && this.loaded) {
            this.updateChildren()
        }
    }

    updateChildren() {
        const visibleChildren = this.children.filter(child=> child.visible);
        if(this._layout.d === 'h') {
            // 计算所有组件的总宽度
            const sumWidth = visibleChildren.reduce((preV, curItem, curIndex, array)=>{
                return preV + curItem._width;
            }, 0) + (visibleChildren.length - 1) + this._gutter.h;
            // 计算起始x
            let startX;
            switch (this._layout.h) {
                case 'center':
                    startX = this._x + (this._width - sumWidth) / 2
                    break;
                case 'left':
                    startX = this._x
                    break;
                case 'right':
                    startX = this._x + this._width - sumWidth;
                    break;
                default:
                    startX = this._x + (this._width - sumWidth) / 2
                    break;
            }
            // 设置子组件位置
            visibleChildren.forEach(child=>{
                var x = startX, y;
                switch (this._layout.v) {
                    case 'center':
                        y = this._y + this._height / 2 - child._height /2;
                        break;
                    case 'top':
                        y = this._y
                        break;
                    case 'bottom':
                        y = this._y + this._height - child._height;
                        break;
                    default:
                        y = this._y + this._height / 2 - child._height /2;
                        break;
                }
                child.x = x
                child.y = y;
                startX = x + child._width + this._gutter.h;
            })
        } else {
            // 计算所有组件的总高度
            const sumHeight = visibleChildren.reduce((preV, curItem, curIndex, array)=>{
                return preV + curItem._height;
            }, 0) + (visibleChildren.length - 1) + this._gutter.v;
            let startY;
            // 计算起始y
            switch (this._layout.v) {
                case 'center':
                startY = this._y + (this._height - sumHeight) / 2;
                    break;
                case 'top':
                startY = this._y
                    break;
                case 'bottom':
                    startY = this._y + this._height - sumHeight;
                    break;
                default:
                    startY = this._y + this._height / 2 - sumHeight /2;
                    break;
            }
            // 计算中间x
            let middleX = this._x + this._width / 2;
            // 设置子组件位置
            visibleChildren.forEach(child=>{
                var x, y = startY;
                switch (this._layout.h) {
                    case 'center':
                        x = this._x + (this._width - child._width) / 2
                        break;
                    case 'left':
                        x = this._x
                        break;
                    case 'right':
                        x = this._x + this._width - child._width;
                        break;
                    default:
                        x = this._x + (this._width - child._width) / 2
                        break;
                }
                child.x = x
                child.y = y;
                startY = y + child._height + this._gutter.v;
            })
        }
        // 更新组件
        visibleChildren.forEach(child=>{
            if(!child.context) {
                child.parent = this;
                child.context = this.context;
                child.Start();
                this.setTouchable(child.touchable);
            }
            else child.Update()
        })
    }

    End() {

    }

    isScope({ x, y }) {
        if(super.isScope({ x, y })) return true;
        const visibleChildren = this.children.filter(child=> child.visible);
        for(var i=0;i<visibleChildren.length;i++) {
            if(visibleChildren[i].isScope({ x, y })) return true;
        }
        return false;
    }
}