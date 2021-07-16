import Scene from "../scenes/scene";

declare namespace RouteHistory {
    let current: object;
    let scenes: Array<Scene>;
    let history: Array<object>;
    function init(): void;
    function addRoute(path:string ,scene:Scene): void;
    function removeRoute(path:string): void;
    function push(path:string, params:object): void;
    function reset(path: string, params:object): void;
    function pop(path:string): void;
    function getCurrent(): void;
}