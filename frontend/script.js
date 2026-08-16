// =============================
// Photon - Real-Time Frontend
// Phase 5 - Subscription UI
// =============================


// -----------------------------
// WebSocket Configuration
// -----------------------------

const WEBSOCKET_URL = "ws://localhost:8000/ws";

let socket = null;
let reconnectTimer = null;
let reconnectAttempts = 0;

const MAX_RECONNECT_DELAY = 5000;


// -----------------------------
// Stock Prices
// -----------------------------

const stockPrices = {
    AAPL: null,
    GOOGL: null,
    TSLA: null,
    MSFT: null
};


// -----------------------------
// Supported Stocks
// -----------------------------

const SUPPORTED_STOCKS = [
    "AAPL",
    "GOOGL",
    "TSLA",
    "MSFT"
];


// -----------------------------
// Subscription State
// -----------------------------

const subscriptions = {
    AAPL: false,
    GOOGL: false,
    TSLA: false,
    MSFT: false
};


// -----------------------------
// Update Connection Status
// -----------------------------

function updateConnectionStatus(status, color) {

    const statusElement =
        document.getElementById("connection-status");

    if (!statusElement) {
        return;
    }

    statusElement.textContent = status;
    statusElement.style.color = color;
}


// -----------------------------
// Update Subscription UI
// -----------------------------

function updateSubscriptionUI(ticker, subscribed) {

    const statusElement =
        document.getElementById(
            `${ticker}-status`
        );

    const buttonElement =
        document.getElementById(
            `${ticker}-button`
        );

    if (!statusElement || !buttonElement) {
        return;
    }

    if (subscribed) {

        statusElement.textContent =
            "● Subscribed";

        statusElement.classList.add(
            "subscribed"
        );

        statusElement.classList.remove(
            "not-subscribed"
        );

        buttonElement.textContent =
            "Unsubscribe";

    } else {

        statusElement.textContent =
            "○ Not Subscribed";

        statusElement.classList.add(
            "not-subscribed"
        );

        statusElement.classList.remove(
            "subscribed"
        );

        buttonElement.textContent =
            "Subscribe";
    }
}


// -----------------------------
// Update Stock Price
// -----------------------------

function updateStockPrice(ticker, newPrice) {

    const priceElement =
        document.getElementById(
            `${ticker}-price`
        );

    const changeElement =
        document.getElementById(
            `${ticker}-change`
        );

    const percentElement =
        document.getElementById(
            `${ticker}-percent`
        );

    const timeElement =
        document.getElementById(
            `${ticker}-time`
        );


    // -------------------------
    // Validate ticker
    // -------------------------

    if (!priceElement) {

        console.warn(
            `Unknown ticker: ${ticker}`
        );

        return;
    }


    // -------------------------
    // Get previous price
    // -------------------------

    const oldPrice =
        stockPrices[ticker];


    // -------------------------
    // First price received
    // -------------------------

    if (oldPrice === null) {

        priceElement.textContent =
            `$${newPrice.toFixed(2)}`;

        stockPrices[ticker] =
            newPrice;


        // Last update time

        if (timeElement) {

            const now = new Date();

            timeElement.textContent =
                `Last update: ${now.toLocaleTimeString()}`;
        }

        return;
    }


    // -------------------------
    // Calculate price change
    // -------------------------

    const priceChange =
        newPrice - oldPrice;


    // -------------------------
    // Calculate percentage
    // -------------------------

    const percentageChange =
        (priceChange / oldPrice) * 100;


    // -------------------------
    // Update main price
    // -------------------------

    priceElement.textContent =
        `$${newPrice.toFixed(2)}`;


    // -------------------------
    // Positive movement
    // -------------------------

    if (priceChange > 0) {

        priceElement.classList.remove(
            "price-down"
        );

        priceElement.classList.add(
            "price-up"
        );


        if (changeElement) {

            changeElement.textContent =
                `▲ +$${priceChange.toFixed(2)}`;

            changeElement.classList.remove(
                "change-down"
            );

            changeElement.classList.add(
                "change-up"
            );
        }


        if (percentElement) {

            percentElement.textContent =
                `+${percentageChange.toFixed(2)}%`;

            percentElement.classList.remove(
                "change-down"
            );

            percentElement.classList.add(
                "change-up"
            );
        }
    }


    // -------------------------
    // Negative movement
    // -------------------------

    else if (priceChange < 0) {

        priceElement.classList.remove(
            "price-up"
        );

        priceElement.classList.add(
            "price-down"
        );


        if (changeElement) {

            changeElement.textContent =
                `▼ -$${Math.abs(priceChange).toFixed(2)}`;

            changeElement.classList.remove(
                "change-up"
            );

            changeElement.classList.add(
                "change-down"
            );
        }


        if (percentElement) {

            percentElement.textContent =
                `-${Math.abs(percentageChange).toFixed(2)}%`;

            percentElement.classList.remove(
                "change-up"
            );

            percentElement.classList.add(
                "change-down"
            );
        }
    }


    // -------------------------
    // No movement
    // -------------------------

    else {

        if (changeElement) {

            changeElement.textContent =
                "$0.00";

            changeElement.classList.remove(
                "change-up",
                "change-down"
            );
        }


        if (percentElement) {

            percentElement.textContent =
                "0.00%";

            percentElement.classList.remove(
                "change-up",
                "change-down"
            );
        }
    }


    // -------------------------
    // Save latest price
    // -------------------------

    stockPrices[ticker] =
        newPrice;


    // -------------------------
    // Last update time
    // -------------------------

    if (timeElement) {

        const now = new Date();

        timeElement.textContent =
            `Last update: ${now.toLocaleTimeString()}`;
    }


    // -------------------------
    // Remove temporary color
    // -------------------------

    setTimeout(() => {

        priceElement.classList.remove(
            "price-up"
        );

        priceElement.classList.remove(
            "price-down"
        );

    }, 500);
}


// -----------------------------
// Toggle Stock Subscription
// -----------------------------

function toggleSubscription(ticker) {

    if (
        !socket ||
        socket.readyState !== WebSocket.OPEN
    ) {

        console.warn(
            "WebSocket is not connected"
        );

        return;
    }


    const action =
        subscriptions[ticker]
            ? "unsubscribe"
            : "subscribe";


    socket.send(
        JSON.stringify({
            action: action,
            ticker: ticker
        })
    );


    console.log(
        `${action} request sent for ${ticker}`
    );
}


// -----------------------------
// Schedule Reconnection
// -----------------------------

function scheduleReconnect() {

    // Prevent multiple reconnect timers

    if (reconnectTimer !== null) {
        return;
    }


    // Exponential backoff:
    //
    // 1s
    // 2s
    // 4s
    // 5s
    // 5s
    // ...

    const delay = Math.min(
        1000 * Math.pow(
            2,
            reconnectAttempts
        ),
        MAX_RECONNECT_DELAY
    );


    console.log(
        `Reconnecting in ${delay / 1000}s...`
    );


    reconnectAttempts++;


    reconnectTimer = setTimeout(() => {

        reconnectTimer = null;

        connectWebSocket();

    }, delay);
}


// -----------------------------
// Connect to WebSocket
// -----------------------------

function connectWebSocket() {

    // Prevent duplicate connections

    if (
        socket &&
        (
            socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING
        )
    ) {

        return;
    }


    updateConnectionStatus(
        "Connecting...",
        "#f59e0b"
    );


    console.log(
        "Connecting to Photon WebSocket..."
    );


    socket =
        new WebSocket(WEBSOCKET_URL);


    // -------------------------
    // Connection Opened
    // -------------------------

    socket.onopen = function () {

        reconnectAttempts = 0;


        updateConnectionStatus(
            "Connected",
            "#22c55e"
        );


        console.log(
            "WebSocket connected successfully."
        );


        // -------------------------
        // Restore subscriptions
        // -------------------------
        //
        // We do NOT subscribe to all
        // stocks automatically.
        //
        // We only restore stocks that
        // the user had previously
        // subscribed to.

        SUPPORTED_STOCKS.forEach(
            ticker => {

                if (subscriptions[ticker]) {

                    socket.send(
                        JSON.stringify({
                            action: "subscribe",
                            ticker: ticker
                        })
                    );


                    console.log(
                        `Restoring subscription: ${ticker}`
                    );
                }
            }
        );
    };


    // -------------------------
    // Message Received
    // -------------------------

    socket.onmessage = function (event) {

        try {

            const data =
                JSON.parse(event.data);


            // ---------------------
            // Subscription response
            // ---------------------

            if (data.type === "subscription") {

                console.log(
                    "Subscription:",
                    data.message
                );


                const parts =
                    data.message.split(" ");


                const action =
                    parts[0];


                const ticker =
                    parts[parts.length - 1];


                if (
                    !SUPPORTED_STOCKS.includes(
                        ticker
                    )
                ) {

                    console.warn(
                        `Unknown subscription ticker: ${ticker}`
                    );

                    return;
                }


                // ---------------------
                // Subscribed
                // ---------------------

                if (action === "Subscribed") {

                    subscriptions[ticker] =
                        true;


                    updateSubscriptionUI(
                        ticker,
                        true
                    );
                }


                // ---------------------
                // Unsubscribed
                // ---------------------

                else if (
                    action === "Unsubscribed"
                ) {

                    subscriptions[ticker] =
                        false;


                    updateSubscriptionUI(
                        ticker,
                        false
                    );
                }


                return;
            }


            // ---------------------
            // Server error
            // ---------------------

            if (data.type === "error") {

                console.error(
                    "Photon server error:",
                    data.message
                );

                return;
            }


            // ---------------------
            // Stock update
            // ---------------------

            if (
                data.ticker &&
                typeof data.price === "number" &&
                SUPPORTED_STOCKS.includes(
                    data.ticker
                )
            ) {

                updateStockPrice(
                    data.ticker,
                    data.price
                );

                return;
            }

        }

        catch (error) {

            console.error(
                "Invalid WebSocket message:",
                error
            );
        }
    };


    // -------------------------
    // Connection Closed
    // -------------------------

    socket.onclose = function () {

        updateConnectionStatus(
            "Disconnected - Reconnecting...",
            "#ef4444"
        );


        console.warn(
            "WebSocket connection closed."
        );


        // IMPORTANT:
        //
        // DO NOT reset subscriptions here.
        //
        // The user's subscription state
        // must survive a temporary connection
        // failure so it can be restored after
        // reconnecting.


        scheduleReconnect();
    };


    // -------------------------
    // WebSocket Error
    // -------------------------

    socket.onerror = function () {

        updateConnectionStatus(
            "Connection Error",
            "#ef4444"
        );


        console.error(
            "WebSocket connection error."
        );
    };
}


// -----------------------------
// Initialize Subscription UI
// -----------------------------

SUPPORTED_STOCKS.forEach(
    ticker => {

        updateSubscriptionUI(
            ticker,
            false
        );
    }
);


// -----------------------------
// Start Application
// -----------------------------

connectWebSocket();