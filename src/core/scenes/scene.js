import SoundManager from "../sound/Manager";

export default class Scene {
    constructor() {
        this.params = {};
        this.touched = false;
        this.paused = false;
        /** 2D UI Components */
        this.children = [];
        /** Controllers */
        this.controllers = [];
        /** 数据存储注入 */
        this.store = null;
        /** 组建名称集合 */
        this.componentMap = {};
        /** 声音控制器 */
        this.soundManager = new SoundManager();
    }
    Init(canvas) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = canvas.getContext('2d', { antialias: true });
        this.context.clearRect(0,0,window.innerWidth, window.innerHeight);
        
        this.bindEvent();
        this.Start(canvas);
    }
    Start() {
        // 允许被替换覆写
    }
    Render() {
        if(this.paused) {
            this.pauseControllers()
            return;
        }
        this.WillUpdate();
        // 更新2D UI 组件
        this.updateChildren();
        // 更新控制器
        this.updateControllers();   
        // 更新声音
        this.updateSoundManager();
        // 更新场景
        this.Update();
    }
    setComponentMap = (_child)=>{
        if(_child._name && !this.componentMap[_child._name]) this.componentMap[_child._name] = _child;
        _child.children.map(child=>{
            this.setComponentMap(child)
        })
    }
    updateChildren() {
        const visibleChildren = this.children.filter(child=> child.visible).sort((a,b)=>{
            if(a._zIndex == b._zIndex) {
                return a.index < b.index;
            }
            return (a._zIndex > b._zIndex);
        });
        visibleChildren.forEach(child=>{
            if(!child.context) {
                child.parent = this;
                child.context = this.context;
                child.Start()
            }
            else child.Update()
            this.setComponentMap(child);
        })
    }
    updateControllers() {
        const visibleController = this.controllers.filter(controller=> controller.visible);
        visibleController.forEach(controller=>{
            if(!controller.context) {
                controller.parent = this;
                controller.store = this.store;
                controller.context = this.context;
                controller.Start()
            }
            else controller.Update()
        })  
    }

    updateSoundManager() {
        if(!this.soundManager.loaded) {
            this.soundManager.Start();
        } else {
            this.soundManager.Update();
        }
    }

    pauseControllers() {
        const visibleController = this.controllers.filter(controller=> controller.visible);
        visibleController.forEach(controller=>{
            controller.Pause();
        })  
    }

    WillUpdate() {

    }
    Update() {
        // 允许被替换覆写
    }
    Unload() {
        this.unbindEvent();
        this.End();
    }
    End() {
        // 允许被替换覆写
    }


    bindEvent() {
        this.canvas.addEventListener('touchstart', this.onTouchStart)
        this.canvas.addEventListener('touchmove', this.onTouchMove)
        this.canvas.addEventListener('touchend', this.onTouchEnd)
    }

    unbindEvent() {
        this.canvas.removeEventListener('touchstart', this.onTouchStart)
        this.canvas.removeEventListener('touchmove', this.onTouchMove)
        this.canvas.removeEventListener('touchend', this.onTouchEnd)
    }

    onTouchStart = (evt)=> {
        console.log('touchstart', evt);
        const touches = evt.touches;
        if(touches.length>=0) {
            this.touched = true;
            const touchPosition = {x: touches[0].pageX, y: touches[0].pageY }
            const children = this.children.filter(child=> child.touchable && child.isScope(touchPosition));
            children.forEach(child=>{
                child.emitTouchStart(evt);
            })
        }
    };

    onTouchMove = (evt)=> {
        console.log('touchmove', evt);
        if(this.touched) {
            const touches = evt.touches;
            if(touches.length>=0) {
                const touchPosition = {x: touches[0].pageX, y: touches[0].pageY }
                const children = this.children.filter(child=> child.touchable && child.touched);
                children.forEach(child=>{
                    child.emitTouchMove(evt);
                })
            }
        }
    }

    onTouchEnd = (evt)=> {
        console.log('touchend',evt);
        this.touched = false;
        const children = this.children.filter(child=> child.touchable && child.touched);
        children.forEach(child=>{
            child.emitTouchEnd(evt);
        })
    }
}