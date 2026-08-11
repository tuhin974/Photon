import random


STOCKS = {
    "AAPL": 150,
    "GOOGL": 2800,
    "TSLA": 700,
    "MSFT": 420
}


SUPPORTED_STOCKS = set(STOCKS.keys())


def generate_stock_data():

    ticker = random.choice(list(STOCKS.keys()))

    base_price = STOCKS[ticker]

    price = round(
        random.uniform(base_price - 5, base_price + 5),
        2
    )

    return {
        "ticker": ticker,
        "price": price
    }