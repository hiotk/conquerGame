import { EventEmitter } from "events";
import Store from "../store/store";

export default class Controller {
    protected visible: boolean
    protected eventEmitter: EventEmitter
    protected isController: boolean
    protected store: Store
    protected clock: THREE.Clock
    protected Start(): void
    protected Update(): void
    protected Pause(): void
    protected End(): void
}