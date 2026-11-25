import { test, before, after } from "node:test";
import assert from "node:assert/strict";

// uruchamianie bazy do testow w pameici, zeby nie dotykala db.js
process.env.DB_FILE = ":memory:";
const { default: app } = await import("../src/app.js");

let server;
let baseUrl;

before(async () => {
    server = app.listen(0); // losowy port
    await new Promise(resolve => server.once("listening", resolve));
    baseUrl = `http://localhost:${server.address().port}`;
});

after(() => server.close());

// pomocnik do wysylania requestow http
async function request(method, path, body) {
    const response = await fetch(baseUrl + path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined
            : typeof body === "string" ? body : JSON.stringify(body)
    });
    const text = await response.text();
    return { status: response.status, body: text ? JSON.parse(text) : null };
}

async function createPlayer(nick, team = "Red") {
    const res = await request("POST", "/api/players", { nick, team });
    assert.equal(res.status, 201);
    return res.body;
}

async function createGame(name) {
    const res = await request("POST", "/api/games", { name });
    assert.equal(res.status, 201);
    return res.body;
}


test("niepoprawny JSON zwraca 400", async () => {
    const res = await request("POST", "/api/players", '{"nick":');
    assert.equal(res.status, 400);
    assert.equal(res.body.error, "Niepoprawny JSON");
});


test("POST /api/players tworzy gracza", async () => {
    const res = await request("POST", "/api/players", { nick: "  Marek ", team: "Team1" });
    assert.equal(res.status, 201);
    assert.equal(res.body.nick, "Marek");
    assert.ok(Number.isInteger(res.body.id));
});

test("POST /api/players bez nicku zwraca 400", async () => {
    const res = await request("POST", "/api/players", { team: "Team1" });
    assert.equal(res.status, 400);
});

test("GET /api/players/:id zwraca gracza albo 404", async () => {
    const player = await createPlayer("Stefan");

    const found = await request("GET", `/api/players/${player.id}`);
    assert.equal(found.status, 200);
    assert.deepEqual(found.body, player);

    const missing = await request("GET", "/api/players/99999");
    assert.equal(missing.status, 404);
});

test("GET /api/players zwraca liste", async () => {
    const res = await request("GET", "/api/players");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
});


test("POST /api/games tworzy gre w statusie waiting", async () => {
    const res = await request("POST", "/api/games", { name: "nowy-mecz" });
    assert.equal(res.status, 201);
    assert.equal(res.body.status, "waiting");
    assert.deepEqual(res.body.playerIds, []);
});

test("POST /api/games z pusta nazwa lub duplikatem zwraca 400", async () => {
    await createGame("gra");
    assert.equal((await request("POST", "/api/games", { name: "gra" })).status, 400);
    assert.equal((await request("POST", "/api/games", { name: "  " })).status, 400);
});

test("GET /api/games/:id: 400 dla zlego id, 404 dla nieistniejacej gry", async () => {
    assert.equal((await request("GET", "/api/games/abc")).status, 400);
    assert.equal((await request("GET", "/api/games/99999")).status, 404);
});

test("pelny scenariusz lobby: dolaczenie dwoch graczy i start", async () => {
    const game = await createGame("gra-pelna");
    const p1 = await createPlayer("Gracz1");
    const p2 = await createPlayer("Gracz2", "Blue");

    const join1 = await request("POST", `/api/games/${game.id}/players`, { playerId: p1.id });
    assert.equal(join1.status, 201);

    const join2 = await request("POST", `/api/games/${game.id}/players`, { playerId: p2.id });
    assert.equal(join2.status, 201);
    assert.deepEqual(join2.body.playerIds, [p1.id, p2.id]);

    const start = await request("PATCH", `/api/games/${game.id}`, { status: "playing" });
    assert.equal(start.status, 200);
    assert.equal(start.body.status, "playing");

    // po starcie nie mozna wyjsc ani dolaczyc
    const leave = await request("DELETE", `/api/games/${game.id}/players/${p1.id}`);
    assert.equal(leave.status, 409);
});

test("dolaczenie: blad gdy gracz nie istnieje, jest juz w grze lub pokoj pelny", async () => {
    const game = await createGame("gra-bledy");
    const p1 = await createPlayer("A1");
    const p2 = await createPlayer("A2");
    const p3 = await createPlayer("A3");
    const join = playerId => request("POST", `/api/games/${game.id}/players`, { playerId });

    assert.equal((await join(99999)).status, 404);   // brak gracza
    assert.equal((await join(p1.id)).status, 201);
    assert.equal((await join(p1.id)).status, 409);   // juz w grze
    assert.equal((await join(p2.id)).status, 201);
    assert.equal((await join(p3.id)).status, 409);   // pelny pokoj
});

test("nie mozna wystartowac gry z jednym graczem ani podac zlego statusu", async () => {
    const game = await createGame("gra-start");
    const p1 = await createPlayer("gracz-solo");
    await request("POST", `/api/games/${game.id}/players`, { playerId: p1.id });

    assert.equal((await request("PATCH", `/api/games/${game.id}`, { status: "playing" })).status, 409);
    assert.equal((await request("PATCH", `/api/games/${game.id}`, { status: "cos" })).status, 400);
});

test("wyjscie z gry przed startem zwraca 204, ponowne 404", async () => {
    const game = await createGame("gra-wyjscie");
    const p1 = await createPlayer("twoj-teammate");
    await request("POST", `/api/games/${game.id}/players`, { playerId: p1.id });

    assert.equal((await request("DELETE", `/api/games/${game.id}/players/${p1.id}`)).status, 204);
    assert.equal((await request("DELETE", `/api/games/${game.id}/players/${p1.id}`)).status, 404);

    const after = await request("GET", `/api/games/${game.id}`);
    assert.deepEqual(after.body.playerIds, []);
});
