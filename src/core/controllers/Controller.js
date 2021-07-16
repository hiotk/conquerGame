import EventEmitter from 'events'

export default class Controller {
    constructor() {
        this.visible = true; // 基础组件默认不展示
        this.eventEmitter = new EventEmitter(); // 事件触发器
        this.eventEmitter.setMaxListeners(3000);
        this.isController = true;
        this.clock = new THREE.Clock();
        this.paused = false;
    }
    Start() {

    }
    Update() {
        if(this.paused) this.paused = false;
        if(!this.clock.running) {
             this.clock.start()
        }
    }
    Pause() {
        this.clock.stop()
        this.paused = true;
    }
    End() {

    }
}