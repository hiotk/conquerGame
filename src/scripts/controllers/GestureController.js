import Controller from "../../core/controllers/Controller";

const Dirs = {
    d: [0,90],
    w: [90,180],
    a: [-180,-90],
    s: [-90, 0]
}

export default class GestureController extends Controller {
    constructor(){
        super()
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.direction = 'c';
        this.isTouch = false;
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        window.addEventListener('touchstart', this.onTouchStart, {
            capture: true,
            passive: false,
            once: false
        })
        window.addEventListener('touchmove', this.onTouchMove, {
            capture: true,
            passive: false,
            once: false
        })
        window.addEventListener('touchend', this.onTouchEnd, {
            capture: true,
            passive: false,
            once: false
        })
    }
    /** 卸载监听事件 */
    unload() {
        window.removeEventListener('touchstart', this.onTouchStart)
        window.removeEventListener('touchmove', this.onTouchMove)
        window.removeEventListener('touchend', this.onTouchEnd)
    }
     //返回角度

    GetSlideAngle(dx,dy) {
        return Math.atan2(dy,dx) * 180 / Math.PI;
    }

    //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    GetSlideDirection() {
        var dy = this.startY - this.endY;
        var dx = this.endX - this.startX;
        //如果滑动距离太短
        if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
           return 'c';
        }
        var angle = this.GetSlideAngle(dx, dy);
        var direction;
        Object.keys(Dirs).forEach(key=>{
            if(angle >= Dirs[key][0] && angle <= Dirs[key][1]) {
                direction = key;
            }
        })
        return direction;
    }
    onTouchStart(e) {
        if(!this.paused) {
            this.startX = e.touches[0].pageX;
            this.startY = e.touches[0].pageY;
            this.isTouch = true;
        }
    }
    onTouchMove(e) {
        if(this.isTouch && !this.paused) {
            this.endX = e.changedTouches[0].pageX;
            this.endY = e.changedTouches[0].pageY;
        }
    }
    onTouchEnd(e) {
        if(this.isTouch && !this.paused) {
            const playerUnit = this.store.getUnit('player');
            this.direction = this.GetSlideDirection();
            console.log(this.direction)
            playerUnit.updateDirection(this.direction);


            this.isTouch = false;
        }
    }
}
