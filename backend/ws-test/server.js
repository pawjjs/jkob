import { WebSocketServer } from "ws";

export function attachTestWebSocket(httpServer) {
    const wsServer = new WebSocketServer({ server: httpServer, path: "/ws", maxPayload: 4096 });

    wsServer.on("connection", (socket) => {
        socket.on("error", (error) => console.error("[WS]", error.message));

        socket.on("message", (data, isBinary) => {
            if (isBinary) {
                socket.send("Wyślij wiadomość tekstową.");
                return;
            }

            const reply = `Odebrano: ${data.toString()}`;
            console.log("[WS]", reply);
            socket.send(reply);
        });
    });
}
