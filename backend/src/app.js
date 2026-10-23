import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend Dormsy działa!");
});

app.get("/ping", (req, res) => {
    res.json({ message: "pong" });
});

export default app;