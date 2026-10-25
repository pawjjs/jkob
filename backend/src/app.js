import express from "express";
import playersRouter from "./routes/players.js";

const app = express();

app.use(express.json());
app.use("/api/players", playersRouter);



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