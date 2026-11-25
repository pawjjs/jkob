import {
    findAllGames, insertGame, findGameById, findGamePlayers,
    insertGamePlayer, deleteGamePlayer, updateGameStatus
} from "../storage/gamesDb.js";
import { findPlayerById } from "../storage/playersDb.js";

const MAX_PLAYERS = 2; //4?

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

export async function readOneGame(id) {
    const gameId = Number(id);

    if (!Number.isSafeInteger(gameId) || gameId <= 0) {
        const error = new Error("nieprawidlowe id gry");
        error.status = 400;
        throw error;
    }

    const game = findGameById(gameId);

    if (!game) {
        const error = new Error("nie znaleziono gry");
        error.status = 404;
        throw error;
    }

    return game;
}

export async function joinGame(id, playerId) {
    const game = await readOneGame(id);

    if (!Number.isSafeInteger(playerId) || playerId <= 0) {
        const error = new Error("nieprawidlowe id gracza");
        error.status = 400;
        throw error;
    }

    const player = findPlayerById(playerId);

    if (!player) {
        const error = new Error("nie znaleziono gracza");
        error.status = 404;
        throw error;
    }

    if (game.status !== "waiting") {
        const error = new Error("gra nie oczekuje na graczy");
        error.status = 409;
        throw error;
    }

    const players = findGamePlayers(game.id);

    if (players.some(player => player.playerId === playerId)) {
        const error = new Error("gracz jest juz w grze");
        error.status = 409;
        throw error;
    }

    if (players.length >= MAX_PLAYERS) {
        const error = new Error("pelny pokoj");
        error.status = 409;
        throw error;
    }

    let position = 1;

    while (players.some(player => player.position === position)) {
        position++;
    }

    insertGamePlayer(game.id, playerId, position);
    return findGameById(game.id);
}

export async function leaveGame(id, playerId) {
    const game = await readOneGame(id);
    const parsedPlayerId = Number(playerId);

    if (!Number.isSafeInteger(parsedPlayerId) || parsedPlayerId <= 0) {
        const error = new Error("nieprawidłowe id gracza");
        error.status = 400;
        throw error;
    }

    if (game.status !== "waiting") {
        const error = new Error("nie mozna opuscic rozpoczetej gry");
        error.status = 409;
        throw error;
    }

    const removed = deleteGamePlayer(game.id, parsedPlayerId);

    if (!removed) {
        const error = new Error("gracz nie nalezy do gry");
        error.status = 404;
        throw error;
    }
}

export async function startGame(id) {
    const game = await readOneGame(id);

    if (game.status !== "waiting") {
        const error = new Error("nie mozna rozpoczac gry");
        error.status = 409;
        throw error;
    }

    const players = findGamePlayers(game.id);

    if (players.length !== MAX_PLAYERS) {
        const error = new Error("za malo graczy");
        error.status = 409;
        throw error;
    }

    return updateGameStatus(game.id, "playing");
}