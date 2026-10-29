import { Router } from "express";
import { getPlayers, getPlayer, createPlayer } from "../controllers/playersController.js";

const router = Router();

router.get("/", getPlayers);
router.get("/:id", getPlayer);
router.post("/", createPlayer);

export default router;
