import { Router } from "express";
import { readAllGames, createGame  } from "../services/games.js";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const games = await readAllGames();
        res.json(games);
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req,res,next)=>{
    try{
    const game = createGame(req.body.name);
    res.status(201).json(game);
    } catch (error) {
        next(error);
    }
})
export default router;