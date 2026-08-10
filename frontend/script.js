// =============================
// Photon - Frontend
// Week 1.5 - Refactored Version
// =============================

// WebSocket URL
const WEBSOCKET_URL = "ws://localhost:8000/ws";

// Create socket
let socket = null;

// Initial stock prices
const stockPrices = {

    AAPL: 150.25,

    GOOGL: 190.50,

    TSLA: 305.75,

    MSFT: 420.30

};

// -----------------------------
// Update Connection Status
// -----------------------------
function updateConnectionStatus(status, color) {

    const statusElement = document.getElementById("connection-status");

    statusElement.textContent = status;
    statusElement.style.color = color;
}

// -----------------------------
// Update Stock Price
// -----------------------------
function updateStockPrice(ticker, newPrice) {

    const priceElement =
        document.getElementById(`${ticker}-price`);

    if (!priceElement) return;

    const oldPrice = stockPrices[ticker];

    if (newPrice > oldPrice) {

        priceElement.classList.remove("price-down");
        priceElement.classList.add("price-up");

    }
    else if (newPrice < oldPrice) {

        priceElement.classList.remove("price-up");
        priceElement.classList.add("price-down");

    }

    priceElement.textContent =
        `$${newPrice.toFixed(2)}`;

    setTimeout(() => {

        priceElement.classList.remove("price-up");
        priceElement.classList.remove("price-down");

    },500);

}
// ------------------------------------
// Generate random price movement
// ------------------------------------
function generateRandomPrice(currentPrice) {

    const change = (Math.random() - 0.5) * 4;

    return currentPrice + change;
}

// ----------------------------- 
// Connect to WebSocket
// -----------------------------
function connectWebSocket() {

    socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = function () {

        console.log("Connected");

        updateConnectionStatus("🟢 Connected", "#22c55e");
    };

    socket.onmessage = function (event) {

        console.log("Message Received");

        console.log(event.data);

        const stock = JSON.parse(event.data);

        updateStockPrice(stock.ticker, stock.price);
    };

    socket.onclose = function () {

        console.log("Disconnected");

        updateConnectionStatus("🔴 Disconnected", "#ef4444");
    };

    socket.onerror = function (error) {

        console.log("WebSocket Error");

        console.log(error);
    };
}


// this function is only for testing purpose, have to be removed in production.
// Otherwise it generate random stock prices and update the UI every second.
// #Testing
function simulateMarket() {

    setInterval(() => {

        for (const ticker in stockPrices) {

            const newPrice =
                generateRandomPrice(stockPrices[ticker]);

            updateStockPrice(
                ticker,
                newPrice
            );

stockPrices[ticker] = newPrice;

        }

    }, 1000);

}


// -----------------------------
// Start Application
// -----------------------------
connectWebSocket();

simulateMarket();
