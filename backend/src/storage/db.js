import { mkdirSync, readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

const dbFile = process.env.DB_FILE;
let databaseFile;

if (dbFile) {
    databaseFile = dbFile;
} else {
    const dataFolder = new URL("../../data/", import.meta.url);
    mkdirSync(dataFolder, { recursive: true });
    databaseFile = new URL("dormsy.db", dataFolder);
}

export const db = new DatabaseSync(databaseFile);

const schemaFile = new URL("../../db/schema.sql", import.meta.url);
const schemaSql = readFileSync(schemaFile, "utf8");

db.exec(schemaSql);
