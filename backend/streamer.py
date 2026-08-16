import asyncio

from config.config import STREAM_INTERVAL
from providers.mock_provider import generate_stock_data


async def stream_stock_data(output_queue: asyncio.Queue):
    """
    Generate mock stock data continuously
    and place it into the output queue.
    """

    while True:

        stock_data = generate_stock_data()

        await output_queue.put(stock_data)

        await asyncio.sleep(STREAM_INTERVAL)