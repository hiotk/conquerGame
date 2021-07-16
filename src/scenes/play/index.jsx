import WebGLScene from '../../core/scenes/webglScene'
import _history from '../../core/route/history'

import player from '../../scripts/models/player'
import CONST from '../../scripts/consts/index'

import DebugUIController from '../../scripts/controllers/DebugUIController';
import PlayerController from '../../scripts/controllers/PlayerController';
import EnemyController from '../../scripts/controllers/EnemyController';
import GestureController from '../../scripts/controllers/GestureController';
import PlaySceneController from '../../scripts/controllers/PlaySceneController';

import JSX, { JSXComponent } from '../../core/ui/JSX';

import CText from '../../core/ui/CText';
import CLayout from '../../core/ui/CLayout';
import CImage from '../../core/ui/CImage';
import CToggleButton from '../../core/ui/CToggleButton';
import Hero from '../../scripts/models/Hero';
import HeroPath from '../../scripts/models/HeroPath';
import Ground from '../../scripts/models/Ground';

import CRect from '../../core/ui/CRect';
import CButton from '../../core/ui/CButton';
import CGroup from '../../core/ui/CGroup';
import HeroShader from '../../scripts/models/HeroShader';

export default class PlayScene extends WebGLScene {
    Start() {
        this.gameOver = false;
        this.paused = false;
        this.InitUnits();
        this.Init3D()
        this.Init2D()
        this.InitControllers();
    }
    Update() {
        if(this.paused) return;
        if(this.gameOver) return;
        // 碰撞检测
        if(this.enemyController.detection()) {
            // Game Over
            // alert('Game Over')
            this.gameOver = true;
            // _history.reset('/home')
            return;
        }
        if(this.playerController.detection()) {
            // Game Over
            this.gameOver = true;
            // _history.reset('/home')
            return;
        }
    }
    End() {
        this.gestureController.unload();
    }

    InitUnits() {
        if(this.store) {
            const enemyUnit = this.store.getUnit('enemy');
            const groundUnit = this.store.getUnit('ground');
            const playerUnit = this.store.getUnit('player');

            enemyUnit.init();
            groundUnit.init();
            playerUnit.init();
        }
    }

    Init3D() {
        var aspect = window.innerWidth / window.innerHeight;
        var width = 10*aspect, height = 10;
        // 更新相机和相机位置
        this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 100 );
        this.camera.position.z = 10;

        this.scene = new THREE.Scene()
        this.scene.add(new THREE.AmbientLight(0xffffff, 1));

        this.hero = new Hero();
        this.hero.preload('./assets/hero/nanzhu.JD');
        this.hero.born(new THREE.Vector3(0,0, CONST.playerSize / 2));

        this.heroPath = new HeroPath();
        this.heroShader = new HeroShader();
        this.ground = new Ground();
        this.models = [];
        this.models.push(this.hero);
        this.models.push(this.heroPath);
        this.models.push(this.ground);
        this.models.push(this.heroShader);
    }

    InitControllers() {
        // 初始化控制器
        this.gestureController = new GestureController(); // 手势控制器
        this.playerController = new PlayerController(); // 玩家控制器
        this.enemyController = new EnemyController(); // 敌人控制器
        this.playSceneController = new PlaySceneController();
        this.controllers = [];
        this.controllers.push(this.gestureController);
        this.controllers.push(this.playerController);
        this.controllers.push(this.enemyController);
        this.controllers.push(this.playSceneController);
    }

    Init2D() {
        this.componentMap = {};
        this.children = [];
        // // 游戏遮罩
        this.children.push(<CImage zIndex={-1} name="gameMask" src="./assets/images/qt/yxzz.png" x={0} y={0} width={window.innerWidth} height={window.innerHeight} />)
        // 游戏分数
        this.children.push(
            <CImage zIndex={0} name="scoreBg" src="./assets/images/qt/fsd.png" x={0} y={-20} width={150} height={48} />
        )
        this.children.push(
            <CLayout zIndex={1} gutter={{h:5, v: 0}} width={window.innerWidth/2} height={30} x={30}>
                <CText name="scoreText" content="9999" width={window.innerWidth/2 - 60} height={30}
                    fontSize={18} fontFamily="NUMBER" textAlign="left" textAlignVertical="center" color="#ffeb5b"
                />
            </CLayout>
        )

        // 暂停和开始
        var scale = 0.88;
        this.children.push(
            <CToggleButton width={40} height={40} x={window.innerWidth - 40} y={0} toggle={false} onchange={(toggle)=>{ this.paused = toggle; }}>
                <CLayout name="ztIcon" x={window.innerWidth - 40} y={0} width={40} height={40}>
                    <CImage src="./assets/images/qt/zt.png" width={23*scale} height={26.5*scale}  />
                </CLayout>
                <CLayout name="ksIcon" x={window.innerWidth - 40} y={0} width={40} height={40}>
                    <CImage src="./assets/images/qt/ks.png" width={23*scale} height={26.5*scale}  />
                </CLayout>
            </CToggleButton>
        )

        // 结束页面
        var rectWidth = window.innerWidth * 0.8;
        var rectTop = (window.innerHeight-rectWidth)/2;

        this.children.push(<CGroup name="gameOver" zIndex={1}>
            <CRect x={0} y={0} width={window.innerWidth} height={rectTop} backgroundColor="rgba(0,0,0,0.1)" />
            <CRect x={window.innerWidth * 0.9} y={rectTop} width={window.innerWidth * 0.1} height={rectWidth} backgroundColor="rgba(0,0,0,0.1)" />
            <CRect x={0} y={rectTop} width={window.innerWidth * 0.1} height={rectWidth} backgroundColor="rgba(0,0,0,0.1)" />
            <CRect x={0} y={rectTop+rectWidth} width={window.innerWidth} height={rectTop} backgroundColor="rgba(0,0,0,0.1)" />
            <CLayout layout={{d:'v',h:'center',v:'bottom'}} x={0} y={0} width={window.innerWidth} height={rectTop}>
                <CText name="highestScore" content="历史最高分数：999" textAlign="center" textAlignVertical="center" color="white" width={window.innerWidth} height={40}/>
                <CText name="overScore" content="分数：" fontFamily="NUMBER" textAlign="center" textAlignVertical="center" color="white" height={40} />
            </CLayout>
            <CLayout x={0} y={rectTop+rectWidth} width={window.innerWidth} height={60}  layout={{d:'h',h:'center',v:'center'}} >
                <CButton
                    name="btnAgain"
                    background={
                        <CLayout>
                            <CImage src="./assets/images/qt/lsan.png" width={210/3} height={72/3} />
                        </CLayout>
                    }
                    content={
                        <CLayout>
                            <CImage src="./assets/images/qt/zwyj.png" width={159/2.5} height={40/2.5} />
                        </CLayout>
                    }
                />
                <CButton
                    name="btnShare"
                    background={
                        <CLayout>
                            <CImage src="./assets/images/qt/hsan.png" width={210/3} height={72/3} />
                        </CLayout>
                    }
                    content={
                        <CLayout>
                            <CImage src="./assets/images/qt/fx.png" width={101/2.5} height={41/2.5} />
                        </CLayout>
                    }
                />
            </CLayout>
            <CText content="当前排名：20" x={20} y={window.innerHeight - 60} textAlign="left" textAlignVertical="center" width={window.innerWidth/2} height={40} color="white" />
        </CGroup>
        )
    }
    /**
     * 重玩逻辑
     */
    Replay() {
        this.End();
        this.Start();
    }
}
