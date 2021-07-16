import Store from "./store";

export default class Unit {
    constructor()
    protected store: Store
    protected state: Object
    protected name: String
    protected setStore(): void
    protected restore(): void
    protected setState(): void
    protected getState(): void
}