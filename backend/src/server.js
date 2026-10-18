import { readFile } from 'node:fs'
import { writeFile } from 'node:fs'
import express from "express";
import { fileURLToPath } from 'node:url';
import path from 'node:path'

const app = express();
const PORT = 3000;
let currentId = 0;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/ping", (req, res) => {
    const filePath = path.join(__dirname, '../data/ping');

    readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            res.status(500)
            res.send("blad odczytywania pliku")
            return
        }
        res.status(200)
        res.send(data);
    })
})

app.post("/zapisz", (req, res) => {
    const d = new Date();
    let hour = d.getHours();
    let minutes = d.getMinutes();
    let seconds = d.getSeconds();

    const filePath = path.join(__dirname, '../data/post');
    let content = `POST nr${++currentId} | ${hour}:${minutes}:${seconds}`;

    writeFile(filePath, content, err => {
        if (err) {
            res.status(500)
            res.send("blad zapisu pliku");
        } else {
            res.status(201)
            res.send(content);
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});