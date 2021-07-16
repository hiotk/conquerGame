import Unit from "./unit";

interface StoreAction {
    public type: string
    public payload: object
}

export default class Store {
    private state: object;
    private prefix: string;
    private allKeys: Array<string>;
    private loaded: boolean;
    private deltaTime: number;
    private units: Array<Unit>;
    public load(): void
    public  restore():void
    public getState(key:string): void
    public setState(key:string,state:object): void
    public getUnit(key:string): void
    public setUnit(key:string,unit:Unit): void
    public dispatch(action: StoreAction): void
}