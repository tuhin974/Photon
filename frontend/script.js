// ==============================
// Photon - Frontend
// Week 1.5 - Refactored Version
// ==============================

// WebSocket URL
const WEBSOCKET_URL = "ws://localhost:8000/ws";

// Create socket
let socket = null;

// ------------------------------
// Update Connection Status
// ------------------------------
function updateConnectionStatus(status, color) {

    const statusElement = document.getElementById("connection-status");

    statusElement.textContent = status;
    statusElement.style.color = color;
}

// ------------------------------
// Update Stock Price
// ------------------------------
function updateStockPrice(ticker, price) {

    const priceElement = document.getElementById(`${ticker}-price`);

    if (!priceElement) {
        return;
    }

    priceElement.textContent = `$${price.toFixed(2)}`;
}

// ------------------------------
// Connect to WebSocket
// ------------------------------
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

// ------------------------------
// Temporary Testing
// ------------------------------
function simulateStockUpdate() {

    setTimeout(() => {

        updateStockPrice("AAPL", 152.35);

    }, 3000);
}

// ------------------------------
// Start Application
// ------------------------------
connectWebSocket();
simulateStockUpdate();