import _history from '../../core/route/history'
import Controller from "../../core/controllers/Controller";

export default class PlaySceneController extends Controller {
    Start() {
        if(this.parent && this.parent.componentMap) {
            this.scoreText = this.parent.componentMap["scoreText"];
            this.overScore = this.parent.componentMap["overScore"];
            this.highestScore = this.parent.componentMap["highestScore"];

            this.btnAgain = this.parent.componentMap["btnAgain"];
            this.btnShare = this.parent.componentMap["btnShare"];

            this.gameOver = this.parent.componentMap['gameOver'];

            this.btnAgain.addEventListener('touchend', ()=> {
                // _history.push("/play")
                // 重新开始游戏
                this.gameOver.visible = false;
                this.parent.Replay();
            })
        }
    }
    Update() {
        // 1. 更新分数
        const playerState = this.store.getUnit('player');
        this.scoreText.content = playerState.state.score.toString();

        // 2. 显示gameOver
        if(playerState.state.score > playerState.state.highestScore){
            playerState.updateHighestScore(playerState.state.score);
        }
        this.overScore.content = '分数：' + playerState.state.score.toString();
        this.highestScore.content = '历史最高分数：' + playerState.state.highestScore;

        if(this.gameOver.visible && this.parent.gameOver) {
           setTimeout(()=>{
            this.parent.paused = true;
           }, 100);
        }
        this.gameOver.visible = this.parent.gameOver;
    }
}
