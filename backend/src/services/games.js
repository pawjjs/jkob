import {writeFile} from "node:fs/promises"
import {readFile} from "node:fs/promises"
import Game from "../model/Game.js";

const gameFile = new URL("../../data/games.json", import.meta.url);

export async function readAllGames(){
    const games = await readFile(gameFile, 'utf-8');
    return JSON.parse(games);
}

export async function createGame(name){

    if(typeof name !== "string" || !name.trim()){
        const error = new Error("podaj nazwe gry");
        error.status = 400;
        throw error;
    }
    const games = await readAllGames();
    const sprawdzenie = games.find(g=>g.name === name);
    if(sprawdzenie){
        const error = new Error("taka nazwa juz istnieje");
        error.status = 400;
        throw error;
    }
    let idMax = 0;

    for (const game of games) {
        if (game.id > idMax) {
            idMax = game.id;
        }
    }

    const id = idMax + 1;

    const game = new Game(id, name);
    games.push(game);


    await writeFile(
            gameFile,
            JSON.stringify(games, null, 2),
            "utf-8"
        );
    return game;
    
}