import { Router } from "express";
import { getGames, addGame } from "../controllers/gamesController.js";

const router = Router();

router.get("/", getGames);
router.post("/", addGame);

export default router;