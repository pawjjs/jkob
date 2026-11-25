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

export function findGameById(id) {
    const game = db.prepare(
        "SELECT id, name, status, winner_id AS winnerId FROM games WHERE id = ?"
    ).get(id);

    if (!game) return undefined;

    const playersInGame = db.prepare(
        "SELECT player_id FROM game_players WHERE game_id = ? ORDER BY position"
    ).all(id);

    return {
        ...game, playerIds: playersInGame.map(row => row.player_id)
    };
}

export function findGamePlayers(gameId) {
    return db.prepare(`
        SELECT player_id AS playerId, position
        FROM game_players
        WHERE game_id = ?
        ORDER BY position
    `).all(gameId);
}

export function insertGamePlayer(gameId, playerId, position) {
    return db.prepare(`
        INSERT INTO game_players (game_id, player_id, position)
        VALUES (?, ?, ?)
        RETURNING game_id AS gameId, player_id AS playerId, position
    `).get(gameId, playerId, position);
}

export function deleteGamePlayer(gameId, playerId) {
    const result = db.prepare(`
        DELETE FROM game_players
        WHERE game_id = ? AND player_id = ?
    `).run(gameId, playerId);

    return result.changes > 0;
}

export function updateGameStatus(gameId, status) {
    const result = db.prepare(`
        UPDATE games
        SET status = ?
        WHERE id = ?
    `).run(status, gameId);

    if (result.changes === 0)
        return undefined;

    return findGameById(gameId);
}