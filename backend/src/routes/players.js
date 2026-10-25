import { Router } from "express";
import { readAllPlayers, addPlayer } from "../services/players.js";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const players = await readAllPlayers();
        res.json(players);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {
    try {
        const player = await addPlayer(req.body);
        res.status(201).json(player);
    } catch (error) {
        next(error);
    }
});

export default router;