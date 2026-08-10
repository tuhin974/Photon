from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio

from streamer import generate_stock_data
from manager import ConnectionManager

app = FastAPI()

manager = ConnectionManager()


@app.get("/")
def home():
    return {"message": "Photon Backend is running"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    await manager.connect(websocket)

    try:
        while True:
            stock_data = generate_stock_data()

            await manager.broadcast(stock_data)

            await asyncio.sleep(1)

    except WebSocketDisconnect:
        manager.disconnect(websocket)