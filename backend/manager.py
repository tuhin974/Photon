from fastapi import WebSocket


class ConnectionManager:

    def __init__(self):
        self.active_connections: dict[WebSocket, set[str]] = {}

    async def connect(self, websocket: WebSocket):
        await websocket.accept()

        # By default, no subscriptions
        self.active_connections[websocket] = set()

    def disconnect(self, websocket: WebSocket):
        self.active_connections.pop(websocket, None)

    def subscribe(self, websocket: WebSocket, ticker: str):
        if websocket in self.active_connections:
            self.active_connections[websocket].add(ticker)

    def unsubscribe(self, websocket: WebSocket, ticker: str):
        if websocket in self.active_connections:
            self.active_connections[websocket].discard(ticker)

    async def broadcast(self, data: dict):

        ticker = data["ticker"]

        disconnected_connections = []

        # Create a snapshot so connections can safely be removed
        for connection, subscriptions in list(
            self.active_connections.items()
        ):

            if ticker not in subscriptions:
                continue

            try:

                await connection.send_json(data)

            except Exception:

                # Connection is no longer usable
                disconnected_connections.append(connection)

        # Remove dead connections after broadcasting
        for connection in disconnected_connections:

            self.disconnect(connection)
