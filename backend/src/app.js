import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.js";
import playersRouter from "./routes/players.js";
import gamesRouter from "./routes/games.js";

const app = express();

app.use(express.json());

app.use("/api/players", playersRouter);
app.use("/api/games", gamesRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => res.send("test"));
app.get("/ping", (req, res) => res.json({ message: "pong" }));

app.use((error, req, res, next) => {
    const status = error.status >= 400 && error.status < 600 ? error.status : 500;
    res.status(status).json({
        error: status === 500 ? "Błąd serwera" : error.message
    });
});

export default app;

/*
{
  "nick": "Bartek",
  "team": "Red"
}
*/ 