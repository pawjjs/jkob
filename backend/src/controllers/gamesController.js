import { readAllGames, createGame } from "../services/games.js";

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
