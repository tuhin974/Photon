// =============================
// Photon - Frontend
// Real-Time WebSocket Stock Ticker
// =============================

// WebSocket URL
const WEBSOCKET_URL = "ws://localhost:8000/ws";

// Stocks displayed on the dashboard
const SUPPORTED_STOCKS = [
    "AAPL",
    "GOOGL",
    "TSLA",
    "MSFT"
];

// Create socket
let socket = null;

// Store latest prices received from backend
const stockPrices = {
    AAPL: 0,
    GOOGL: 0,
    TSLA: 0,
    MSFT: 0
};


// -----------------------------
// Update Connection Status
// -----------------------------

function updateConnectionStatus(status, color) {

    const statusElement =
        document.getElementById("connection-status");

    statusElement.textContent = status;
    statusElement.style.color = color;
}


// -----------------------------
// Update Stock Price
// -----------------------------

function updateStockPrice(ticker, newPrice) {

    const priceElement =
        document.getElementById(`${ticker}-price`);

    if (!priceElement) {
        console.warn(`No price element found for ${ticker}`);
        return;
    }

    const oldPrice = stockPrices[ticker];

    // Determine price movement
    if (oldPrice !== 0) {

        if (newPrice > oldPrice) {

            priceElement.classList.remove("price-down");
            priceElement.classList.add("price-up");

        }
        else if (newPrice < oldPrice) {

            priceElement.classList.remove("price-up");
            priceElement.classList.add("price-down");

        }
    }

    // Update price
    priceElement.textContent =
        `$${newPrice.toFixed(2)}`;

    // Store latest price
    stockPrices[ticker] = newPrice;

    // Remove animation class after 500ms
    setTimeout(() => {

        priceElement.classList.remove("price-up");
        priceElement.classList.remove("price-down");

    }, 500);
}


// -----------------------------
// Subscribe to Stock
// -----------------------------

function subscribeToStock(ticker) {

    if (socket && socket.readyState === WebSocket.OPEN) {

        const subscription = {
            action: "subscribe",
            ticker: ticker
        };

        socket.send(JSON.stringify(subscription));

        console.log(`Subscribed to ${ticker}`);
    }
}


// -----------------------------
// Connect to WebSocket
// -----------------------------

function connectWebSocket() {

    socket = new WebSocket(WEBSOCKET_URL);

    socket.onopen = function () {

        console.log("Connected to Photon WebSocket");

        updateConnectionStatus(
            "🟢 Connected",
            "#22c55e"
        );

        // Subscribe to all dashboard stocks
        SUPPORTED_STOCKS.forEach(ticker => {

            subscribeToStock(ticker);

        });
    };


    socket.onmessage = function (event) {

        console.log("Message Received:");
        console.log(event.data);

        try {

            const data = JSON.parse(event.data);

            // Subscription confirmation
            if (data.type === "subscription") {

                console.log(
                    "Subscription:",
                    data.message
                );

                return;
            }

            // Backend error
            if (data.type === "error") {

                console.error(
                    "Backend Error:",
                    data.message
                );

                return;
            }

            // Stock update
            if (
                data.ticker &&
                typeof data.price === "number"
            ) {

                updateStockPrice(
                    data.ticker,
                    data.price
                );

            }

        }
        catch (error) {

            console.error(
                "Invalid WebSocket message:",
                error
            );
        }
    };


    socket.onclose = function () {

        console.log("Disconnected");

        updateConnectionStatus(
            "🔴 Disconnected",
            "#ef4444"
        );
    };


    socket.onerror = function (error) {

        console.error(
            "WebSocket Error:",
            error
        );

        updateConnectionStatus(
            "🔴 Connection Error",
            "#ef4444"
        );
    };
}


// -----------------------------
// Start Application
// -----------------------------

connectWebSocket();