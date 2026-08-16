import asyncio
import json
import websockets


async def client(name, ticker):

    uri = "ws://127.0.0.1:8000/ws"

    async with websockets.connect(uri) as websocket:

        print(f"\n{name} connected")

        await websocket.send(json.dumps({
            "action": "subscribe",
            "ticker": ticker
        }))

        response = await websocket.recv()

        print(f"{name} subscription:")
        print(response)

        print(f"{name} waiting for {ticker} updates...")

        received = 0

        while received < 5:

            message = await websocket.recv()

            data = json.loads(message)

            print(
                f"{name} → "
                f"{data['ticker']}: ${data['price']}"
            )

            received += 1


async def main():

    print("Starting multiple client test...")

    await asyncio.gather(
        client("Client 1", "AAPL"),
        client("Client 2", "GOOGL")
    )

    print("\nMultiple client test completed!")


asyncio.run(main())