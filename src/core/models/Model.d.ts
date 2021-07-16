import { EventEmitter } from "events";

export default class Model {
    protected visible: boolean
    protected eventEmitter: EventEmitter;
    protected isModel: boolean;
    protected clock: THREE.Clock;
    protected Start(): void
    protected Update(): void
    protected End(): void
}