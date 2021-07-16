import RouteHistory from '../route/history'
import Store from '../store/store';
import Unit from '../store/unit'

export default class Application {
    private history: RouteHistory;
    private platform: Application.Platform
    private store: Store;
    private units: Array<Unit>;
    private element: HTMLElement;
    private loaded: boolean;
    private storeDeltaTime: number;
    private lastStoreTime: number;
    private animate(): void
    public start(): void
}