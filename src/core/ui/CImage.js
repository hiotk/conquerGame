import Component from "./Component";
/**
 * 图片组件
 */
export default class CImage extends Component {
    /**
     * 图片组件构造函数
     * @param {string} source 
     * @param {function} callback 构建完成的回调函数
     */
    constructor() {
        super();
        this.visible = true;
        this.source = '';
        this.isCImage = true;
        this.props = this.props.concat(['src']);
    }

    set src(v) {
        this.source  = v;
        this.setSource(v);
    }

    /** 重新设置图片资源路径 */
    setSource(source) {
        // 卸载已经加载的图片
        if(this.img) {
            this.img.remove()
        }
        // 重新绘制
        var self = this;
        var img = document.createElement('img');
        img.onload = () => {
            self.loaded = true;
            if(this._onload) {
                this._onload()
            }
        }
        img.src = source;
        this.source = source;
        this.img = img;
    }

    Start() {
        var self = this;
        var img = document.createElement('img');
        img.onload = () => {
            self.loaded = true;
            if(this._onload) {
                this._onload()
            }
        }
        img.src = this.source;
        this.img = img;
    }

    Update() {
        if(this.visible && this.loaded && this.img && this.context) {
            this.context.drawImage(this.img,this._x,this._y, this._width, this._height);
        }
    }

    End() {
        this.img.remove();
    }
}