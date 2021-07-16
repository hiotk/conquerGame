import Component from "./Component";

export default class CGroup extends Component {
    constructor() {
        super()
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
        // 更新组件
        visibleChildren.forEach(child=>{
            if(!child.context) {
                child.parent = this;
                child.context = this.context;
                child.Start()
                this.setTouchable(child.touchable);
            }
            else child.Update()
        })
    }
    End() {

    }

    /**
     * 判断鼠标点击区域是否在区域之上
     * @param {number} x X坐标
     * @param {number} y Y坐标
     */
    isScope({ x, y }) {
        if(super.isScope({ x, y })) return true;
        const visibleChildren = this.children.filter(child=> child.visible);
        for(var i=0;i<visibleChildren.length;i++) {
            if(visibleChildren[i].isScope({ x, y })) return true;
        }
        return false;
    }
}