import { readAllGames, createGame, readOneGame, joinGame,
    leaveGame, startGame } from "../services/games.js";

export async function getGames(req, res, next) {
    try {
        const games = await readAllGames();
        res.json(games);
    } catch (error) {
        next(error);
    }
}

export async function addGame(req, res, next) {
    try {
        const game = await createGame(req.body?.name);
        res.status(201).json(game);
    } catch (error) {
        next(error);
    }
}

export async function getGame(req, res, next) {
    try {
        const game = await readOneGame(req.params.id);
        res.json(game);
    } catch (error) {
        next(error);
    }
}

export async function addGamePlayer(req, res, next) {
    try {
        const game = await joinGame(
            req.params.id,
            req.body?.playerId
        );

        res.status(201).json(game);
    } catch (error) {
        next(error);
    }
}

export async function removeGamePlayer(req, res, next) {
    try {
        await leaveGame(
            req.params.id,
            req.params.playerId
        );

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

export async function changeGameStatus(req, res, next) {
    try {
        const status = req.body?.status;

        if (status !== "playing") {
            const error = new Error("nieprawidlowy status gry");
            error.status = 400;
            throw error;
        }

        const game = await startGame(req.params.id);

        res.json(game);
    } catch (error) {
        next(error);
    }
}