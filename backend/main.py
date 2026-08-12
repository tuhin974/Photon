from fastapi import FastAPI, WebSocket, WebSocketDisconnect
import asyncio
import logging

from backend.streamer import generate_stock_data, SUPPORTED_STOCKS
from backend.manager import ConnectionManager


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("photon")


app = FastAPI()

manager = ConnectionManager()


@app.get("/")
def home():
    return {
        "project": "Photon",
        "status": "running",
        "websocket": "/ws"
    }


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

    logger.info("WebSocket client connected")

    try:

        while True:

            message = await websocket.receive_json()

            action = message.get("action")
            ticker = message.get("ticker")

            if ticker:
                ticker = ticker.upper()

            # Validate action
            if action not in {"subscribe", "unsubscribe"}:

                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid action"
                })

                continue

            # Validate ticker
            if ticker not in SUPPORTED_STOCKS:

                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid ticker"
                })

                continue

            if action == "subscribe":

                manager.subscribe(websocket, ticker)

                logger.info(f"Client subscribed to {ticker}")

                await websocket.send_json({
                    "type": "subscription",
                    "message": f"Subscribed to {ticker}"
                })

            elif action == "unsubscribe":

                manager.unsubscribe(websocket, ticker)

                logger.info(f"Client unsubscribed from {ticker}")

                await websocket.send_json({
                    "type": "subscription",
                    "message": f"Unsubscribed from {ticker}"
                })

    except WebSocketDisconnect:

        manager.disconnect(websocket)

        logger.info("WebSocket client disconnected")