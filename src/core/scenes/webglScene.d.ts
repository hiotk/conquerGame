import Scene from "./scene";
import Model from "../models/Model";

export default class WebGLScene extends Scene {
    /** 3D场景 */
    protected scene: THREE.Scene;
    /** 3D相机 */
    protected camera: THREE.Camera;
    /** 3D渲染器 */
    protected renderer: THREE.Renderer;
    /** 3D 模型 */
    protected models: Array<Model>;
    /** 窗口大小变化 */
    private onWindowResize():void
    /** 渲染模型 */
    protected updateModels():void
}