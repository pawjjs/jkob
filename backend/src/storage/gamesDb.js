import { db } from "./db.js";

export function findAllGames() {
    const games = db.prepare(
        "SELECT id, name, status, winner_id AS winnerId FROM games ORDER BY id"
    ).all();

    const playersInGame = db.prepare(
        "SELECT player_id FROM game_players WHERE game_id = ? ORDER BY position"
    );

    return games.map(game => ({
        ...game,
        playerIds: playersInGame.all(game.id).map(row => row.player_id)
    }));
}

export function insertGame(name) {
    const game = db.prepare(`
        INSERT INTO games (name) VALUES (?)
        ON CONFLICT(name) DO NOTHING
        RETURNING id, name, status, winner_id AS winnerId
    `).get(name);

    if (!game) return undefined;
    return { ...game, playerIds: [] };
}
