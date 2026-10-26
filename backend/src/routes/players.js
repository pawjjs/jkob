import { Router } from "express";
import { readAllPlayers, addPlayer, readOnePlayer } from "../services/players.js";

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

router.get("/:id", async (req, res, next)=>{
try {
    const id = req.params.id;
    const player = await readOnePlayer(id);

    if(!player){
        return res.status(404).json({
                error: "Nie znaleziono gracza"
            });
    }
    res.json(player);

}catch (error){
    next(error)
}
});

export default router;