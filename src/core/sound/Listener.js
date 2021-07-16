export default class SoundListener {
    constructor() {
        this.target = {
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            up: {
                x: 0,
                y: 0,
                z: 1
            },
            forward: {
                x: 0,
                y: 1,
                z: 0
            }
        }
        this.index = SoundListener.Index++;
    }
    static Index = 0;
    bindTarget(target) {
        this.target = target;
    }
    Start() {

    }
    Update() {
        if(!this.ctx) return;
        if(this.target && this.target.position && this.target.forward && this.target.up) {
            const { position, forward, up } = this.target;
            const listener = this.ctx.listener;
            if(listener.forwardX) {
                listener.forwardX.setValueAtTime(forward.x, this.ctx.currentTime);
                listener.forwardY.setValueAtTime(forward.y, this.ctx.currentTime);
                listener.forwardZ.setValueAtTime(forward.z, this.ctx.currentTime);
                listener.upX.setValueAtTime(up.x, this.ctx.currentTime);
                listener.upY.setValueAtTime(up.y, this.ctx.currentTime);
                listener.upZ.setValueAtTime(up.z, this.ctx.currentTime);
                listener.positionX.setValueAtTime(position.x, this.ctx.currentTime);
                listener.positionY.setValueAtTime(position.y, this.ctx.currentTime);
                listener.positionZ.setValueAtTime(position.z, this.ctx.currentTime);
            } else {
                listener.setOrientation(forward.x, forward.y, forward.z, up.x, up.y, up.z);
                listener.setPosition(position.x, position.y, position.z);
            }
        }
    }
    End() {

    }
}