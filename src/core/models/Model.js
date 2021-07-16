import EventEmitter from 'events'

export default class Model {
    constructor() {
        this.visible = false; // 基础组件默认不展示
        this.eventEmitter = new EventEmitter(); // 事件触发器
        this.eventEmitter.setMaxListeners(3000);
        this.isModel = true;
        this.clock = new THREE.Clock();
        this.position = { x: 0, y: 0, z: 0}
        this.up = { x: 0, y: 0, z: 1}
        this.forward = { x: 0, y: 1, z: 0}
    }
    Start() {

    }
    Update() {

    }
    End() {

    }
}