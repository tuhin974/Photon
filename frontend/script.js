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