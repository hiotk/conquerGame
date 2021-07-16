class SourceLoader {
    constructor(source) {
        this.source = source;
        this.loadedSize = 0;
        this.totalSize = 0;
        this.loaded = false;
    
    }
    download(callback = ()=>{}) {
        var xhr = new XMLHttpRequest();
        xhr.onload = ()=>{
            this.loadedSize = this.totalSize;
            this.loaded = true;
        }
        xhr.onprogress = (ev)=>{
            this.totalSize  = ev.total;
            this.loadedSize = ev.loaded;
            callback()
        }
        xhr.open('get', this.source, true);
        xhr.send();
    }
}


export default class Preload {
    constructor() {
        this.loadedSize = 0;
        this.totalSize = 0;
        this.percent = 0;
        this.sources = [];
        this.preloading = false;
        this.loaders = [];
    }
    addSource(source) {
        if(this.preloading) {
            this.download(source);
        }
        this.sources.push(source);
    }
    preload() {
        this.preloading = true;
        this.loaders = [];
        this.sources.forEach(source=>{
            this.download(source);
        })
    }
    download(source) {
        var sourceLoader = new SourceLoader(source);
        sourceLoader.download(()=> this.update());
        this.loaders.push(sourceLoader);
    }
    update(){
        this.loadedSize = 0;
        this.totalSize = 0;
        this.loaders.forEach(loader=>{
            this.loadedSize += loader.loadedSize;
            this.totalSize += loader.totalSize;
        })
        if(this.totalSize === 0) {
            this.percent = 0;
        } else {
            this.percent = (this.loadedSize * 100) / this.totalSize;
        }
    }
}