export default class Game {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.playerIds = [];
        this.status = "waiting";
        this.winnerId = null;
    }
}
