import Unit from "../../core/store/unit";

export default class RoomUnit extends Unit {
    constructor() {
        super('room');
        this.state = {
            roomId: null,
            players: []
        }
    }

    unitAction({ type, payload }) {
        console.log(type, payload);
    }
}