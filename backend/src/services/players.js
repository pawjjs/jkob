import {writeFile} from "node:fs/promises"
import {readFile} from "node:fs/promises"
import Player from "../model/Player.js";

const playerFile = new URL("../../data/players.json", import.meta.url);


export async function addPlayer(dane)
{
    const {nick, team} = dane;

    if (
        typeof nick !== "string" || !nick.trim() ||
        typeof team !== "string" || !team.trim()
    ) {
        const error = new Error("Podaj nick i drużynę");
        error.status = 400;
        throw error;
    }

    const players = await readAllPlayers();
    let maxId = 0;

    for (const player of players) {
    if (player.id > maxId) {
        maxId = player.id;
    }}

    const id = maxId + 1;

    const player = new Player(id, nick.trim(), team.trim());

    players.push(player);

    await writeFile(
        playerFile,
        JSON.stringify(players, null, 2),
        "utf-8"
    );

    return player;
}

export async function readOnePlayer(id){
    const players = await readAllPlayers();
    return players.find(player => player.id === Number(id));
}

export async function readAllPlayers() {
    const data = await readFile(playerFile, "utf-8");
    return JSON.parse(data);
}
