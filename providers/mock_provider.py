import random

from config.config import SUPPORTED_STOCKS


STOCKS = {
    "AAPL": 150,
    "GOOGL": 2800,
    "TSLA": 700,
    "MSFT": 420
}


def generate_stock_data():

    ticker = random.choice(SUPPORTED_STOCKS)

    base_price = STOCKS[ticker]

    price = round(
        random.uniform(
            base_price - 5,
            base_price + 5
        ),
        2
    )

    return {
        "ticker": ticker,
        "price": price
    }