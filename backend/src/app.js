import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { readFileSync } from "node:fs";
import playersRouter from "./routes/players.js";
import gamesRouter from "./routes/games.js";

const app = express();

app.use(express.json());

const spec = YAML.parse(
    readFileSync(new URL("./openapi.yaml", import.meta.url), "utf8")
);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));

app.use("/api/players", playersRouter);

app.use("/api/games", gamesRouter);

app.get("/", (req, res) => {
    res.send("Backend Dormsy działa!");
});

app.get("/ping", (req, res) => {
    res.json({ message: "pong" });
});

app.use((error, req, res, next) => {
    const status = error.status || 500;

    if (status >= 500) {
        console.error(error);
    }

    const message = error.type === "entity.parse.failed"
        ? "Niepoprawny JSON"
        : error.message;

    res.status(status).json({
        error: status >= 500 ? "Blad serwera" : message
    });
});

export default app;
