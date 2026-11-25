// czysci baze i ustawia testowe dane
import { db } from "../src/storage/db.js";

const players = [
    { nick: "Ala", team: "Team1" },
    { nick: "Olek", team: "Team2" },
    { nick: "Kuba", team: "Team3" },
    { nick: "Zosia", team: "Team4" }
];

const games = [
    { name: "AlaIOlek", status: "playing", playerNicks: ["Ala", "Olek"] },
    { name: "Pokoj Kuby", status: "waiting", playerNicks: ["Kuba"] },
    { name: "Pusty pokoj", status: "waiting", playerNicks: [] }
];

db.exec("BEGIN");
try {
    db.exec("DELETE FROM game_players; DELETE FROM games; DELETE FROM players;");

    const insertPlayer = db.prepare("INSERT INTO players (nick, team) VALUES (?, ?) RETURNING id");
    const insertGame = db.prepare("INSERT INTO games (name, status) VALUES (?, ?) RETURNING id");
    const insertGamePlayer = db.prepare(
        "INSERT INTO game_players (game_id, player_id, position) VALUES (?, ?, ?)"
    );

    const playerIds = {};
    for (const p of players) {
        playerIds[p.nick] = insertPlayer.get(p.nick, p.team).id;
    }

    for (const g of games) {
        const gameId = insertGame.get(g.name, g.status).id;
        g.playerNicks.forEach((nick, i) => insertGamePlayer.run(gameId, playerIds[nick], i + 1));
    }

    db.exec("COMMIT");
    console.log(`Seed gotowy: ${players.length} graczy, ${games.length} gry.`);

} catch (error) {
    db.exec("ROLLBACK");
    console.error("Cos poszlo nie tak przy seedowanie bazy:", error);
    process.exitCode = 1;
}
