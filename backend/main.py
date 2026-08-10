from fastapi import FastAPI, WebSocket
import asyncio

from streamer import generate_stock_data


app = FastAPI()


@app.get("/")
def home():
    return {"message": "Photon Backend is running"}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):

    await websocket.accept()

    while True:

        stock_data = generate_stock_data()

        await websocket.send_json(stock_data)

        await asyncio.sleep(1)