export default class Application {
    constructor({ history, platform, store, units, element }) {
        this.history = history;
        this.platform = platform;
        this.store = store;
        this.units = units;
        this.element = element;
        this.loaded = false;
        this.storeDeltaTime = 1000;
        this.lastStoreTime = 0;
    }
    static Platform = {
        H5: 'H5',
        MiniGame: 'MiniGame',
    }
    animate() {
        requestAnimationFrame(()=>this.animate());
        this.history.current.scene.Render();
        if(Date.now() - this.lastStoreTime > this.storeDeltaTime) {
            this.lastStoreTime = Date.now();
            this.units.forEach(unit=>unit.persist());
            this.store.persist();
        }
    }
    start() {
        this.store.load();
        this.units.forEach(unit=>{
            unit.setStore(this.store);
            unit.restore();
        })
        var canvas = document.createElement('canvas');
        this.history.current.store = this.store;
        this.history.current.scene.Init(canvas);
        if(this.platform === Application.Platform.H5) {
            if(this.element instanceof HTMLElement) {
                this.element.appendChild(canvas);
            } else {
                document.body.appendChild(canvas);
            }
        }
        this.loaded = true;
        this.animate();
    }
}
