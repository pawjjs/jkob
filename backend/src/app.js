import express from "express";
import playersRouter from "./routes/players.js";
import gamesRouter from "./routes/games.js";

const app = express();

app.use(express.json());
app.use("/api/players", playersRouter);

app.use("/api/games", gamesRouter);

app.get("/", (req, res) => {
    res.send("Backend Dormsy działa!");
});

app.get("/ping", (req, res) => {
    res.json({ message: "pong" });
});





export default app;

/*
{
  "nick": "Bartek",
  "team": "Red"
}
*/ 