import Scene from "./scene";
import Model from "../models/Model";

export default class BabylonScene extends Scene {
    /** 3D场景 */
    protected scene: BABYLON.Scene;
    /** 3D相机 */
    protected camera: BABYLON.Camera;
    /** 3D渲染器 */
    protected renderCanvas: HTMLCanvasElement;
    /** Babylon渲染器 */
    protected engine: BABYLON.Engine;
    /** 3D 模型 */
    protected models: Array<Model>;
    /** 窗口大小变化 */
    private onWindowResize():void
    /** 渲染模型 */
    protected updateModels():void
}