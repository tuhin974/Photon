Photon — Real-Time WebSocket Stock Ticker

Photon is a real-time stock ticker web application developed as an internship project at Infyntrek Systèmes.

The project demonstrates how a Python backend can use WebSockets to push stock-price updates to a web browser in real time, without requiring the user to refresh the page.

Internship Project

Organization: Infyntrek Systèmes

Project: Photon — Real-Time WebSocket Stock Ticker

Team Members:

Tuhin Roy — Team Lead

Manish Gawde — Team Member

Project Objective

Financial traders and hobbyists need up-to-the-minute stock price information. Traditional web pages that require manual refreshing can be slow and may cause users to miss updates.

Photon provides a web dashboard where stock prices are continuously generated and pushed from the Python backend to connected browsers through a WebSocket connection.

Key Modules

1. WebSocket Server

A FastAPI backend provides a WebSocket endpoint:

/ws

The server accepts WebSocket connections and handles subscription and unsubscription requests.

2. Mock Data Streamer

Photon currently uses a mock stock-data provider to simulate live stock ticks.

The application generates stock prices for:

AAPL

GOOGL

TSLA

MSFT

A new stock update is generated every second.

3. Broadcast Manager

The connection manager keeps track of connected clients and their stock subscriptions.

When new stock data is generated, the manager sends the update only to clients subscribed to that stock.

4. Frontend Client

The frontend uses HTML, CSS, and JavaScript.

The browser connects to the backend through WebSockets and updates stock prices immediately when new data is received.

The interface also shows:

Current stock price

Price movement

Percentage movement

Last update time

Subscription status

WebSocket connection status

Technology Stack

Backend

Python

FastAPI

WebSockets

Uvicorn

asyncio

Frontend

HTML

CSS

JavaScript

Browser WebSocket API

Development Tools

Git

GitHub

Project Structure

Photon/
│
├── backend/
│   ├── main.py
│   ├── manager.py
│   ├── streamer.py
│   └── __init__.py
│
├── config/
│   ├── config.py
│   └── __init__.py
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── providers/
│   ├── mock_provider.py
│   └── __init__.py
│
├── assets/
├── docs/
├── backend_test.py
├── edge_case_test.py
├── requirements.txt
├── README.md
└── .gitignore

How Photon Works

Mock Stock Provider
        │
        ▼
Stock Data Streamer
        │
        ▼
Async Queue
        │
        ▼
FastAPI Broadcast Worker
        │
        ▼
Connection Manager
        │
        ├──────────────► Client 1
        │
        ├──────────────► Client 2
        │
        └──────────────► Client 3
                 │
                 ▼
          WebSocket Updates
                 │
                 ▼
          Browser Dashboard

Each client can subscribe to the stocks it wants to receive.

For example:

{
    "action": "subscribe",
    "ticker": "AAPL"
}

To unsubscribe:

{
    "action": "unsubscribe",
    "ticker": "AAPL"
}

Running the Project

1. Open the project directory

cd D:\Photon

2. Start the FastAPI server

python -m uvicorn backend.main:app --reload

The backend will run at:

http://127.0.0.1:8000

The WebSocket endpoint is:

ws://localhost:8000/ws

3. Open the frontend

Open:

frontend/index.html

in a browser.

The dashboard will connect to the WebSocket server and can subscribe to the available stocks.

Testing

Photon includes tests for multiple clients and WebSocket edge cases.

Multiple Client Test

Run:

python backend_test.py

This verifies that multiple clients can connect and receive updates for their subscribed stocks.

Edge Case Test

Run:

python edge_case_test.py

The edge-case tests cover:

Invalid ticker

Invalid WebSocket action

Lowercase ticker handling

Subscribe/unsubscribe behavior

Current Project Scope

The current implementation follows the internship project requirements and uses a mock stock data streamer.

The main focus is:

FastAPI WebSocket server

Real-time mock stock data

Multiple connected clients

Stock subscriptions

Real-time frontend updates

Basic price movement indication

WebSocket connection handling

The project intentionally keeps the implementation focused on the specified internship requirements.

Project Status

Completed

Photon successfully demonstrates a real-time stock dashboard where stock updates are pushed to the browser through WebSockets without requiring page refreshes.

Internship

This project was developed as part of an internship at Infyntrek Systèmes.

Team:

Tuhin Roy — Team Lead

Manish Gawde — Team Member