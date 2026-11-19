import { findAllPlayers, findPlayerById, insertPlayer } from "../storage/playersDb.js";

export async function addPlayer(data) {
    const nick = typeof data?.nick === "string" ? data.nick.trim() : "";
    const team = typeof data?.team === "string" ? data.team.trim() : "";

    if (!nick || !team) {
        const error = new Error("Podaj nick i drużynę");
        error.status = 400;
        throw error;
    }

    return insertPlayer(nick, team);
}

export async function readOnePlayer(id) {
    const playerId = Number(id);
    if (!Number.isSafeInteger(playerId)) return undefined;

    return findPlayerById(playerId);
}

export async function readAllPlayers() {
    return findAllPlayers();
}
