import Scene from '../../core/scenes/scene'
import _history from '../../core/route/history'
import Preload from '../../core/utils/Preload';

export default class LoadingScene extends Scene {
    Start() {
        this.precent = 0;
        this.context.fillStyle = "#f090b2"
        this.context.fillRect(0,0, window.innerWidth, window.innerHeight)

        const sources = [
            'assets/fonts/04B_03_.svg',
            'assets/fonts/04B_03_.ttf',
            'assets/audio/button.wav',
            'assets/audio/bird.wav',
            'assets/audio/coin.wav',
            'assets/audio/eyu.wav',
            'assets/audio/circle.mp3',
            'assets/audio/die.mp3',
            'assets/audio/bgm.mp3',
            'assets/audio/walk.wav',
            'assets/audio/game over.mp3',
            'assets/audio/win.wav',
            'assets/audio/item.mp3',
            'assets/bird/bird.png',
            'assets/bird/帧数表.txt',

            'assets/bird/bird.JD',

            'assets/EMO/帧数表.txt',

            'assets/EMO/emo.png',
            'assets/EMO/emo.JD',
            'assets/EYU/EYU.JD',
            'assets/EYU/帧数表.txt',
            'assets/EYU/EYU .png',
            'assets/hero/帧数表.txt',
            'assets/images/qt/db_1.png',
            'assets/images/qt/db_2.png',
            'assets/fonts/04B_03_.ttf?da1a9fbcd9ded63df072427001b24e21',
            'assets/hero/nanzhu.png',
            'assets/images/qt/dj_1.png',
            'assets/images/qt/fhyx.png',
            'assets/images/qt/gjx.png',
            'assets/images/qt/fx.png',
            'assets/images/qt/hosan.png',
            'assets/images/qt/dj_2.png',
            'assets/images/qt/fs.png',
            'assets/images/qt/ks.png',
            'assets/images/qt/jstd.png',
            'assets/images/qt/ksyx.png',
            'assets/images/qt/jszz.png',
            'assets/hero/nanzhu.JD',
            'assets/images/qt/phb_fg.png',
            'assets/images/qt/hsan.png',
            'assets/images/qt/lsan.png',
            'assets/images/qt/pm_qh1.png',
            'assets/images/qt/pm_qh2.png',
            'assets/images/qt/phb.png',
            'assets/images/qt/pm1.png',
            'assets/images/qt/logo.png',
            'assets/images/qt/pm2.png',
            'assets/images/qt/ssjt.png',
            'assets/images/qt/xjl.png',
            'assets/images/qt/xzzj.png',
            'assets/images/qt/zt.png',
            'assets/images/qt/pm3.png',
            'assets/images/qt/phb_bg.jpg',
            'assets/images/qt/zwyj.png',

            'assets/images/qt/yxzz.png',

            'assets/images/qt/qd.png',
            'assets/images/qt/zy_bg.jpg',
            'assets/女主/nvzhu.JD',

            'assets/女主/nvzhu.png',
        ]
        this.preload = new Preload();
        this.preload.sources.push(...sources)
        this.preload.preload();
    }
    Update() {
        this.context.clearRect(0,0, window.innerWidth, window.innerHeight)
        this.context.fillStyle = "#f090b2"
        this.context.fillRect(0,0, window.innerWidth, window.innerHeight)
        this.context.fillStyle = "white"
        this.context.font ="30px Times New Roman";
        var text = this.precent.toFixed(0) + "%";
        var size = this.context.measureText(text)
        this.context.fillText(text, window.innerWidth / 2 - size.width / 2, window.innerHeight/2);
        // 跳转页面
        this.precent = this.preload.percent;
        if(this.precent === 100) {
            _history.push('/home', {})
        }

    }
    End() {
        this.context.fillStyle = "#f090b2"
        this.context.fillRect(0,0, window.innerWidth, window.innerHeight)
    }
}
