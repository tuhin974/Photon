import random


def generate_stock_data():
    return {
        "ticker": "AAPL",
        "price": round(random.uniform(145, 155), 2)
    }