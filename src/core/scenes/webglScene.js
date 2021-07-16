import Scene from './scene'

export default class WebGLScene extends Scene {
    constructor() {
        super();
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 )
        this.scene = new THREE.Scene()
        /** 3D Models */
        this.models = [];
    }
    Init(canvas) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = canvas.getContext('2d');
        this.context.clearRect(0,0,window.innerWidth, window.innerHeight)
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        // this.renderer = new THREE.CanvasRenderer( { antialias: true, canvas } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.bindEvent();
        this.Start(this.renderer);
    }
    Start() {
        // 允许被替换覆写
    }
    Render() {
        if(this.paused) {
            this.pauseControllers()
            return;
        }
        if(this.renderer)
            this.renderer.render( this.scene, this.camera );
        this.context.drawImage(this.renderer.domElement, 0, 0);

        this.WillUpdate();
        // 更新2D UI 组件
        this.updateChildren();
        // 更新控制器
        this.updateControllers();
        // 更新3D模型
        this.updateModels();
        // 更新场景
        this.Update();

    }
    WillUpdate() {
        // 允许被替换覆写
    }
    Update() {
        // 允许被替换覆写
    }
    Unload() {
        window.removeEventListener( 'resize', this.onWindowResize, false );
        this.unbindEvent();
        this.End();
    }
    End() {
        // 允许被替换覆写
    }
    // size事件触发
    onWindowResize() {
        if(this.renderer) {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize( window.innerWidth, window.innerHeight );
        }
    }

    updateModels() {
        const visibleModel = this.models.filter(model=> model.visible);
        visibleModel.forEach(model=>{
            if(!model.context) {
                model.parent = this;
                model.context = this.context;
                model.scene = this.scene;
                model.camera = this.camera;
                model.Start()
            }
            else model.Update()
        })
    }
}