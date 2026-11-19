import { db } from "./db.js";

export function findAllPlayers() {
    return db.prepare("SELECT id, nick, team FROM players ORDER BY id").all();
}

export function findPlayerById(id) {
    return db.prepare("SELECT id, nick, team FROM players WHERE id = ?").get(id);
}

export function insertPlayer(nick, team) {
    return db.prepare("INSERT INTO players (nick, team) VALUES (?, ?) RETURNING id, nick, team").get(nick, team);
}