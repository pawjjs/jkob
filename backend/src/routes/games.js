import { Router } from "express";
import { getGames, addGame, getGame, addGamePlayer,
    removeGamePlayer, changeGameStatus } from "../controllers/gamesController.js";
const router = Router();

router.get("/", getGames);
router.post("/", addGame);
router.get("/:id", getGame);
router.post("/:id/players", addGamePlayer);
router.delete("/:id/players/:playerId", removeGamePlayer);
router.patch("/:id", changeGameStatus);
export default router;