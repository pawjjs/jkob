import { createServer } from "node:http";
import app from "./app.js";
import { attachTestWebSocket } from "../ws-test/server.js";

const PORT = 3000;
const httpServer = createServer(app);
attachTestWebSocket(httpServer);

httpServer.listen(PORT, () => {
    console.log(`Serwer działa: http://localhost:${PORT}`);
    console.log(`WebSocket działa: ws://localhost:${PORT}/ws`);
});
