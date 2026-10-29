import { readAllPlayers, readOnePlayer, addPlayer } from "../services/players.js";

export async function getPlayers(req, res, next) {
    try { res.json(await readAllPlayers()); } catch (error) { next(error); }
}

export async function getPlayer(req, res, next) {
    try {
        const player = await readOnePlayer(req.params.id);
        if (!player) return res.status(404).json({ error: "Nie znaleziono gracza" });
        res.json(player);
    } catch (error) { next(error); }
}

export async function createPlayer(req, res, next) {
    try { res.status(201).json(await addPlayer(req.body)); } catch (error) { next(error); }
}
