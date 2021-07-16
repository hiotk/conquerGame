import * as BABYLON from 'babylonjs';
import Scene from './scene'

export default class BabylonScene extends Scene {
    constructor() {
        super();
        this.renderCanvas = document.createElement('canvas');
        this.engine = new BABYLON.Engine(this.renderCanvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, 3), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.renderCanvas, false);

        /** 3D Models */
        this.models = [];
    }
    Init(canvas) {
        this.canvas = canvas;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = canvas.getContext('2d');
        this.context.clearRect(0,0,window.innerWidth, window.innerHeight);

        this.renderCanvas.width = window.innerWidth;
        this.renderCanvas.height = window.innerHeight;

        this.Start();

        // 此处启用Babylon的循环机制
        this.engine.runRenderLoop(()=> {
            if(this.paused) {
                this.pauseControllers()
                return;
            }
            this.scene.render();
            this.context.drawImage(this.renderCanvas, 0, 0);

            this.WillUpdate();
            // 更新2D UI 组件
            this.updateChildren();
            // 更新控制器
            this.updateControllers();
            // 更新3D模型
            this.updateModels();
            // 更新场景
            this.Update();
        });
        window.addEventListener('resize', this.onWindowResize);
    }
    Start() {
        // 允许被替换覆写
    }
    Render() {
        // 此处函数就不在书写任何逻辑，注意不能在子类中覆写
    }
    WillUpdate() {
        // 允许被替换覆写
    }
    Update() {
        // 允许被替换覆写
    }
    Unload() {
        window.removeEventListener('resize', this.onWindowResize);
        this.End();
    }
    End() {
        // 允许被替换覆写
    }

    onWindowResize = ()=> {
        this.engine.resize();
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