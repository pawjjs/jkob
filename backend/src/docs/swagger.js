const errorResponse = {
    description: "Błąd", content: {
        "application/json": {
            schema: {
                $ref: "#/components/schemas/Error"
            }
        }
    }
};

const swaggerDocument = {
    openapi: "3.0.3",
    info: { title: "Dormsy API", version: "1.0.0", description: "Podstawowe API gry Dormsy: gracze i pokoje" },
    servers: [{ url: "http://localhost:3000" }],
    tags: [{ name: "Players" }, { name: "Games" }],
    components: { schemas: {
        Player: { type: "object", properties: { id: { type: "integer", example: 1 }, nick: { type: "string", example: "Adam" }, team: { type: "string", example: "Red" } } },
        NewPlayer: { type: "object", required: ["nick", "team"], properties: { nick: { type: "string", example: "Nowy" }, team: { type: "string", example: "Blue" } } },
        Game: { type: "object", properties: { id: { type: "integer", example: 1 }, name: { type: "string", example: "Pokój Bartka" }, playerIds: { type: "array", items: { type: "integer" } }, status: { type: "string", example: "waiting" }, winnerId: { type: "integer", nullable: true } } },
        NewGame: { type: "object", required: ["name"], properties: { name: { type: "string", example: "Nowy pokój" } } },
        Error: { type: "object", properties: { error: { type: "string" } } }
    } },
    paths: {
        "/api/players": {
            get: { tags: ["Players"], summary: "Lista graczy", responses: { "200": { description: "Gracze", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Player" } } } } }, "500": errorResponse } },
            post: { tags: ["Players"], summary: "Dodaj gracza", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/NewPlayer" } } } }, responses: { "201": { description: "Utworzony gracz", content: { "application/json": { schema: { $ref: "#/components/schemas/Player" } } } }, "400": errorResponse } }
        },
        "/api/players/{id}": { get: { tags: ["Players"], summary: "Pobierz gracza po ID", parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }], responses: { "200": { description: "Gracz", content: { "application/json": { schema: { $ref: "#/components/schemas/Player" } } } }, "404": errorResponse } } },
        "/api/games": {
            get: { tags: ["Games"], summary: "Lista pokoi gry", responses: { "200": { description: "Pokoje", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Game" } } } } }, "500": errorResponse } },
            post: { tags: ["Games"], summary: "Utwórz pokój gry", requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/NewGame" } } } }, responses: { "201": { description: "Utworzony pokój", content: { "application/json": { schema: { $ref: "#/components/schemas/Game" } } } }, "400": errorResponse } }
        }
    }
};

export default swaggerDocument;
