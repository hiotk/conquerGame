import Scene from '../../core/scenes/scene'
import _history from '../../core/route/history'

import JSX, { JSXComponent } from '../../core/ui/JSX';
import CImage from '../../core/ui/CImage';
import CText from '../../core/ui/CText';
import CButton from '../../core/ui/CButton';
import CLayout from '../../core/ui/CLayout';
import SoundSpeaker from '../../core/sound/Speaker';


export default class HomeScene extends Scene {
    Start() {
        this.context.fillStyle = "white"
        this.context.fillRect(0,0, window.innerWidth, window.innerHeight)
        // 背景图片
        this.children.push(<CImage src="./assets/images/qt/zy_bg.jpg" x={0} y={0} width={window.innerWidth} height={window.innerHeight} zIndex={-1} />)
        // logo
        var logoWidth = window.innerWidth * 0.78;
        var logoHeight = logoWidth / 599 * 144;
        this.children.push(<CImage src="./assets/images/qt/logo.png" x={(window.innerWidth - logoWidth)/2} y={logoHeight*0.68} width={logoWidth} height={logoHeight} />)
        // 排行榜图片
        this.children.push(<CImage src='./assets/images/qt/phb.png' x={20} y={window.innerHeight - 50} width={47} height={44} />)

        // 开始游戏
        var hosanWidth = 185;
        var hosanHeight = 51;
        this.children.push(
            <CButton
                background={<CImage src='./assets/images/qt/ctms.png' x={window.innerWidth / 2 - hosanWidth /2} y={window.innerHeight - 140} width={hosanWidth} height={hosanHeight} />}
                x={window.innerWidth / 2 - hosanWidth /2} y={window.innerHeight - 140} width={hosanWidth} height={hosanHeight}
                ontouchstart={()=> this.startSoundSpeaker.play()}
                ontouchend={()=> _history.push('/play')}
            />
        )
        this.startSoundSpeaker = new SoundSpeaker('assets/audio/button.wav');
        this.startSoundSpeaker.volume = Number.MAX_VALUE;
        this.startSoundSpeaker.visible = true;
        this.soundManager.addSpeaker(this.startSoundSpeaker);
    }
    Update() {
        // this.context.fillStyle = "white"
        // this.context.fillRect(0,0, window.innerWidth, window.innerHeight)
    }
    End() {

    }
}
