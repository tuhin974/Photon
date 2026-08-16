from fastapi import FastAPI, WebSocket, WebSocketDisconnect

import asyncio
import logging

from backend.streamer import stream_stock_data
from backend.manager import ConnectionManager
from config.config import SUPPORTED_STOCKS


# -----------------------------
# Logging
# -----------------------------

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger("photon")


# -----------------------------
# FastAPI Application
# -----------------------------

app = FastAPI()


# -----------------------------
# Connection Manager
# -----------------------------

manager = ConnectionManager()


# -----------------------------
# Stock Data Queue
# -----------------------------

stock_queue = asyncio.Queue()


# -----------------------------
# Home Route
# -----------------------------

@app.get("/")
def home():

    return {
        "project": "Photon",
        "status": "running",
        "websocket": "/ws"
    }


# -----------------------------
# Start Stock Stream
# -----------------------------

@app.on_event("startup")
async def start_stock_stream():

    async def stream():

        try:

            await stream_stock_data(
                stock_queue
            )

        except asyncio.CancelledError:

            logger.info(
                "Stock data stream stopped."
            )

            raise

        except Exception as error:

            logger.exception(
                f"Stock data stream failed: {error}"
            )

    asyncio.create_task(stream())


# -----------------------------
# Broadcast Worker
# -----------------------------

@app.on_event("startup")
async def start_broadcast_worker():

    async def broadcast_worker():

        while True:

            stock_data = await stock_queue.get()

            logger.info(
                f"Broadcasting "
                f"{stock_data['ticker']} "
                f"-> ${stock_data['price']:.2f}"
            )

            await manager.broadcast(
                stock_data
            )

            stock_queue.task_done()

    asyncio.create_task(
        broadcast_worker()
    )


# -----------------------------
# WebSocket Endpoint
# -----------------------------

@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket
):

    await manager.connect(
        websocket
    )

    logger.info(
        "WebSocket client connected"
    )

    try:

        while True:

            message = (
                await websocket.receive_json()
            )

            action = message.get(
                "action"
            )

            ticker = message.get(
                "ticker"
            )


            # -------------------------
            # Normalize ticker
            # -------------------------

            if ticker:

                ticker = ticker.upper()


            # -------------------------
            # Validate action
            # -------------------------

            if action not in {
                "subscribe",
                "unsubscribe"
            }:

                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid action"
                })

                continue


            # -------------------------
            # Validate ticker
            # -------------------------

            if ticker not in SUPPORTED_STOCKS:

                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid ticker"
                })

                continue


            # -------------------------
            # Subscribe
            # -------------------------

            if action == "subscribe":

                manager.subscribe(
                    websocket,
                    ticker
                )

                logger.info(
                    f"Client subscribed to "
                    f"{ticker}"
                )

                await websocket.send_json({
                    "type": "subscription",
                    "message":
                        f"Subscribed to {ticker}"
                })


            # -------------------------
            # Unsubscribe
            # -------------------------

            elif action == "unsubscribe":

                manager.unsubscribe(
                    websocket,
                    ticker
                )

                logger.info(
                    f"Client unsubscribed from "
                    f"{ticker}"
                )

                await websocket.send_json({
                    "type": "subscription",
                    "message":
                        f"Unsubscribed from {ticker}"
                })


    except WebSocketDisconnect:

        manager.disconnect(
            websocket
        )

        logger.info(
            "WebSocket client disconnected"
        )