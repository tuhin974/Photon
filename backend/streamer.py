from config.config import DATA_SOURCE, SUPPORTED_STOCKS

from providers.mock_provider import generate_stock_data as generate_mock_stock_data


def generate_stock_data():

    if DATA_SOURCE == "mock":

        return generate_mock_stock_data()

    raise ValueError(
        f"Unsupported data source: {DATA_SOURCE}"
    )