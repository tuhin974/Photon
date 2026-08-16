import asyncio
import json
import websockets


async def test_invalid_ticker():
    print("\n========== TEST 1: INVALID TICKER ==========")

    uri = "ws://127.0.0.1:8000/ws"

    async with websockets.connect(uri) as websocket:

        await websocket.send(json.dumps({
            "action": "subscribe",
            "ticker": "INVALID"
        }))

        response = await websocket.recv()

        print("Server response:")
        print(response)


async def test_invalid_action():
    print("\n========== TEST 2: INVALID ACTION ==========")

    uri = "ws://127.0.0.1:8000/ws"

    async with websockets.connect(uri) as websocket:

        await websocket.send(json.dumps({
            "action": "something",
            "ticker": "AAPL"
        }))

        response = await websocket.recv()

        print("Server response:")
        print(response)


async def test_lowercase_ticker():
    print("\n========== TEST 3: LOWERCASE TICKER ==========")

    uri = "ws://127.0.0.1:8000/ws"

    async with websockets.connect(uri) as websocket:

        await websocket.send(json.dumps({
            "action": "subscribe",
            "ticker": "aapl"
        }))

        response = await websocket.recv()

        print("Server response:")
        print(response)

        print("\nWaiting for AAPL stock update...")

        while True:

            message = await websocket.recv()

            data = json.loads(message)

            if data.get("ticker") == "AAPL":

                print(
                    f"AAPL update received: ${data['price']}"
                )

                break


async def test_unsubscribe():
    print("\n========== TEST 4: UNSUBSCRIBE ==========")

    uri = "ws://127.0.0.1:8000/ws"

    async with websockets.connect(uri) as websocket:

        # Subscribe
        await websocket.send(json.dumps({
            "action": "subscribe",
            "ticker": "AAPL"
        }))

        response = await websocket.recv()

        print("Subscribe response:")
        print(response)

        # Unsubscribe
        await websocket.send(json.dumps({
            "action": "unsubscribe",
            "ticker": "AAPL"
        }))

        response = await websocket.recv()

        print("Unsubscribe response:")
        print(response)

        print("\nWaiting 3 seconds to verify no AAPL updates...")

        try:

            while True:

                message = await asyncio.wait_for(
                    websocket.recv(),
                    timeout=3
                )

                data = json.loads(message)

                if data.get("ticker") == "AAPL":

                    print("❌ ERROR: AAPL update received after unsubscribe!")

                    return

        except asyncio.TimeoutError:

            print("✅ No AAPL updates received.")
            print("Unsubscribe test passed.")


async def main():

    print("====================================")
    print(" Photon - Phase 6 Edge Case Tests")
    print("====================================")

    await test_invalid_ticker()

    await test_invalid_action()

    await test_lowercase_ticker()

    await test_unsubscribe()

    print("\n====================================")
    print(" All edge-case tests completed!")
    print("====================================")


asyncio.run(main())