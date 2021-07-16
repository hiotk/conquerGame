import SoundListener from "./Listener";
import SoundSpeaker from "./Speaker";

window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;

export default class SoundManager {
    constructor() {
        this.ctx = new AudioContext();   
        this.listener = new SoundListener();
        this.Speakers = [];
        this.loaded = false;
    }
    
    bindListener(listener) {
        if(listener instanceof SoundListener) {
            this.listener = listener;
        }
    }
    addSpeaker(speaker) {
        if(speaker instanceof SoundSpeaker) {
            this.Speakers.push(speaker);
        }
    }

    Start() {
        this.loaded = true;
    }
    Update() {
        if(!this.listener.ctx) {
            this.listener.ctx = this.ctx;
            this.listener.Start();
        } else {
            this.listener.Update();
        }
        this.Speakers.filter(speaker=> speaker.visible && speaker.volume>0).forEach(speaker=>{
            if(!speaker.ctx) {
                speaker.ctx = this.ctx;
                speaker.Start();
            } else {
                speaker.Update();
            }
        })
    }
    End() {
        this.loaded = false;
    }
}