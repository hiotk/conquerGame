
import JSX, { JSXComponent } from '../../core/ui/JSX';

import Scene from '../../core/scenes/scene';
import CGroup from '../../core/ui/CGroup';
import CText from '../../core/ui/CText';
import CLayout from '../../core/ui/CLayout';

/**
 * 双人匹配界面
 */
export default class PrepareScene extends Scene {
    Start(){
        this.Init2D();
        this.startTime = Date.now();
        this.status = 'preparing';
        this.second = 0;
    }
    Update(){
        switch(this.status) {
            case 'preparing':
                this.componentMap['prepared'].visible = false;
                this.componentMap['preparing'].visible = true;
                const currentTime = Date.now();
                this.second = Math.floor((currentTime - this.startTime) / 1000);
                const txtTime = this.componentMap["time"];
                txtTime.content = `已匹配时长：${this.second}s`;
                break;
            case 'prepared':
                this.componentMap['prepared'].visible = true;
                this.componentMap['preparing'].visible = false;

                break;
        }
    }
    End(){

    }

    Init2D() {
        this.second = 0;
        this.children.push(<CGroup name="preparing">
            <CLayout width={window.innerWidth} height={window.innerHeight}>
                <CText content="正在匹配中..."  height={40} width={window.innerWidth} textAlign="center" textAlignVertical="center" />
                <CText name="time" content={`已匹配时长：${this.second}s`} width={window.innerWidth} height={40} textAlignVertical="center" />
            </CLayout>
        </CGroup>)

        this.children.push(<CGroup name="prepared">



        </CGroup>)
    }
}
