import { findAllGames, insertGame } from "../storage/gamesDb.js";

export async function readAllGames() {
    return findAllGames();
}

export async function createGame(name) {
    if (typeof name !== "string" || !name.trim()) {
        const error = new Error("podaj nazwe gry");
        error.status = 400;
        throw error;
    }

    const game = insertGame(name);
    if (!game) {
        const error = new Error("taka nazwa juz istnieje");
        error.status = 400;
        throw error;
    }
    return game;
}
