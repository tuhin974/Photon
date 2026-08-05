// WebSocket URL
const socket = new WebSocket("ws://localhost:8000/ws");

// Connection opened
socket.onopen = function () {

    console.log("Connected to server");

    document.getElementById("connection-status").textContent =
        "🟢 Connected";

};

// Receive message
socket.onmessage = function (event) {

    console.log("Message Received:");

    console.log(event.data);

    const stock = JSON.parse(event.data);

    const priceElement =
        document.getElementById(`${stock.ticker}-price`);

    if(priceElement){

        priceElement.textContent =
            `$${stock.price.toFixed(2)}`;

    }

};

// Connection closed
socket.onclose = function () {

    console.log("Disconnected");

    document.getElementById("connection-status").textContent =
        "🔴 Disconnected";

};

// Error
socket.onerror = function (error) {

    console.log("WebSocket Error");

    console.log(error);

};


// Temporary testing code.
// Remove this block once the backend starts sending real WebSocket messages.

setTimeout(() => {

    const fakeMessage = {

        ticker: "AAPL",

        price: 152.35

    };

    const priceElement =
        document.getElementById(`${fakeMessage.ticker}-price`);

    if(priceElement){

        priceElement.textContent =
            `$${fakeMessage.price.toFixed(2)}`;

    }

},3000);