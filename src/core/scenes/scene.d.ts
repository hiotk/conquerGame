import Component from "../ui/Component";
import Controller from "../controllers/Controller";
import Store from "../store/store";
import SoundManager from "../sound/Manager";

export default class Scene {
    /** 2D场景 */
    protected canvas: HTMLCanvasElement;
    /** 2D绘制上下文 */
    protected context: CanvasRenderingContext2D;
    /** 子元素 */
    protected children: Array<Component>;
    /** 控制器 */
    protected controllers: Array<Controller>;
    /** 数据存储 */
    protected store: Store;
    /** 组建集合 */
    protected componentMap: Object;
    /** 声音控制器 */
    protected soundManager: SoundManager;
    /** 构造函数，初始化相机和场景 */
    constructor()
    /** 初始化场景 */
    public Init(canvas: HTMLCanvasElement):void
    /** 场景开始渲染 */
    protected Start():void
    /** 渲染场景 */
    public Render():void
    /** 即将更新渲染 */
    public WillUpdate(): void
    /** 更新渲染 */
    protected Update():void
    /** 卸载场景 */
    public Unload():void
    /** 离开场景 */
    protected End():void
    /** 渲染组件 */
    protected updateChildren():void
    /** 渲染控制器 */
    protected updateControllers():void
    /** 绑定事件 */
    protected bindEvent(): void
    /** 解绑事件 */
    protected unbindEvent(): void
}