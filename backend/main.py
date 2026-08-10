from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio

from streamer import generate_stock_data
from manager import ConnectionManager

app = FastAPI()

manager = ConnectionManager()


@app.get("/")
def home():
    return {"message": "Photon Backend is running"}

@app.on_event("startup")
async def start_stock_stream():

    async def stream():
        while True:
            stock_data = generate_stock_data()

            await manager.broadcast(stock_data)

            await asyncio.sleep(1)

    asyncio.create_task(stream())


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    await manager.connect(websocket)

    try:
        while True:
            message = await websocket.receive_json()

            action = message.get("action")
            ticker = message.get("ticker")

            if action == "subscribe":
                manager.subscribe(websocket, ticker)

                await websocket.send_json({
                    "message": f"Subscribed to {ticker}"
                })

            elif action == "unsubscribe":
                manager.unsubscribe(websocket, ticker)

                await websocket.send_json({
                    "message": f"Unsubscribed from {ticker}"
                })

    except WebSocketDisconnect:
        manager.disconnect(websocket)