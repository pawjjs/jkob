import { readAllGames, createGame } from "../services/games.js";

export async function getGames(req, res, next) {
    try { res.json(await readAllGames()); } catch (error) { next(error); }
}

export async function addGame(req, res, next) {
    try { res.status(201).json(await createGame(req.body?.name)); } catch (error) { next(error); }
}
