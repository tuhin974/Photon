# Photon — Real-Time WebSocket Stock Ticker

> **Internship Project — Infyntrek Systèmes**

Photon is a real-time stock ticker web application developed as part of an internship at **Infyntrek Systèmes**. The project demonstrates real-time communication between a Python backend and a web browser using **WebSockets**, allowing stock-price updates to be delivered instantly without requiring a page refresh.

---

## 👥 Internship Team

| Role | Name |
|---|---|
| Team Lead | **Tuhin Roy** |
| Team Member | **Manish Gowda** |

**Organization:** Infyntrek Systèmes

---

## 📌 Problem Statement

Financial traders and hobbyists need up-to-the-minute stock price information.

Traditional web pages that require manual refreshing are too slow and can lead to missed updates. Photon addresses this problem by maintaining a persistent WebSocket connection between the browser and the Python backend so that new stock-price data can be pushed to the client in real time.

---

## 🎯 Use Case

A user opens the Photon web application and sees a dashboard containing their selected stocks.

As new stock data is generated:

- The price updates instantly.
- Price increases are indicated in **green**.
- Price decreases are indicated in **red**.
- The user does not need to refresh the page.
- The user can subscribe to individual stocks.
- The user can unsubscribe when they no longer want to receive updates.

---

## 🧩 Key Modules

### 1. WebSocket Server

The backend is built with **FastAPI** and provides a WebSocket endpoint:

```text
/ws
```

The endpoint handles client connections and receives subscription and unsubscription requests.

### 2. Mock Data Streamer

Photon uses a mock stock-data streamer to simulate live stock ticks.

The supported stocks are:

- `AAPL`
- `GOOGL`
- `TSLA`
- `MSFT`

The streamer generates a new stock update every second.

Example:

```json
{
  "ticker": "AAPL",
  "price": 150.25
}
```

### 3. Broadcast Manager

The `ConnectionManager` maintains the list of connected WebSocket clients and their individual stock subscriptions.

When a new stock update is generated, the manager sends it only to clients subscribed to that particular ticker.

### 4. Frontend Client

The frontend is implemented using:

- HTML
- CSS
- JavaScript
- Browser WebSocket API

The JavaScript client receives JSON messages from the backend and updates the corresponding stock card in real time.

### 5. Subscription System

Clients can subscribe to individual stocks.

Example:

```json
{
  "action": "subscribe",
  "ticker": "AAPL"
}
```

Clients can also unsubscribe:

```json
{
  "action": "unsubscribe",
  "ticker": "AAPL"
}
```

The backend validates both the requested action and ticker.

---

## 🛠️ Technology Stack

### Backend

- **Python**
- **FastAPI**
- **WebSockets**
- **Uvicorn**
- **asyncio**

### Frontend

- **HTML5**
- **CSS3**
- **JavaScript**
- **WebSocket API**

### Development & Version Control

- **Git**
- **GitHub**

---

## 🏗️ Project Architecture

```text
                    ┌──────────────────────┐
                    │   Mock Stock Provider │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Stock Streamer    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Async Data Queue  │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Broadcast Worker    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Connection Manager   │
                    └──────────┬───────────┘
                               │
                  WebSocket Updates
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
        ┌──────────┐     ┌──────────┐     ┌──────────┐
        │ Client 1 │     │ Client 2 │     │ Client 3 │
        └──────────┘     └──────────┘     └──────────┘
              │                │                │
              └────────────────┼────────────────┘
                               ▼
                    ┌──────────────────────┐
                    │  Web Dashboard       │
                    │  HTML/CSS/JavaScript │
                    └──────────────────────┘
```

---

## 📂 Project Structure

```text
Photon/
│
├── backend/
│   ├── __init__.py
│   ├── main.py
│   ├── manager.py
│   ├── streamer.py
│   └── requirements.txt
│
├── config/
│   ├── __init__.py
│   └── config.py
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── providers/
│   ├── __init__.py
│   └── mock_provider.py
│
├── assets/
│   └── .gitkeep
│
├── docs/
│   └── .gitkeep
│
├── backend_test.py
├── edge_case_test.py
├── requirements.txt
├── README.md
└── .gitignore
```

---

## ⚙️ How the Application Works

The application follows this flow:

1. The FastAPI server starts.
2. The mock stock streamer begins generating stock-price data.
3. Stock updates are placed into an asynchronous queue.
4. The broadcast worker retrieves each update.
5. The `ConnectionManager` checks the subscriptions of connected clients.
6. The update is sent to clients subscribed to that stock.
7. The browser receives the JSON message through WebSocket.
8. JavaScript updates the corresponding stock card.
9. The price movement is visually indicated as an increase or decrease.

All of this happens without manually refreshing the webpage.

---

## 🚀 Running the Project

### 1. Open the project directory

```powershell
cd D:\Photon
```

### 2. Start the FastAPI backend

```powershell
python -m uvicorn backend.main:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

The WebSocket endpoint is:

```text
ws://localhost:8000/ws
```

### 3. Start the frontend

Open a second terminal:

```powershell
cd D:\Photonrontend
python -m http.server 5500
```

Then open:

```text
http://localhost:5500
```

Using a local HTTP server avoids browser restrictions associated with opening the HTML file directly through `file://`.

---

## 🧪 Testing

Photon includes dedicated tests for WebSocket communication and edge cases.

### Multiple Client Test

Run:

```powershell
python backend_test.py
```

This verifies that multiple clients can connect simultaneously and receive updates according to their individual subscriptions.

### Edge Case Test

Run:

```powershell
python edge_case_test.py
```

The test verifies:

- Invalid ticker handling
- Invalid action handling
- Lowercase ticker handling
- Subscribe functionality
- Unsubscribe functionality
- No updates after unsubscribing

### Final Test Result

The implemented tests have been successfully passed, including:

- Multiple WebSocket clients
- Individual stock subscriptions
- Invalid ticker validation
- Invalid action validation
- Lowercase ticker normalization
- Unsubscribe behavior

---

## 🔄 Example WebSocket Messages

### Subscribe

```json
{
  "action": "subscribe",
  "ticker": "AAPL"
}
```

Server response:

```json
{
  "type": "subscription",
  "message": "Subscribed to AAPL"
}
```

### Unsubscribe

```json
{
  "action": "unsubscribe",
  "ticker": "AAPL"
}
```

Server response:

```json
{
  "type": "subscription",
  "message": "Unsubscribed from AAPL"
}
```

### Stock Update

```json
{
  "ticker": "AAPL",
  "price": 151.36
}
```

### Invalid Ticker

```json
{
  "type": "error",
  "message": "Invalid ticker"
}
```

### Invalid Action

```json
{
  "type": "error",
  "message": "Invalid action"
}
```

---

## 📊 Current Project Scope

Photon has been implemented according to the core internship project requirements.

### Included

- FastAPI WebSocket server
- `/ws` WebSocket endpoint
- Mock real-time stock data
- One-second stock data generation
- Multiple WebSocket clients
- Stock subscription system
- Stock unsubscription system
- Client-specific broadcasting
- Real-time HTML/JavaScript dashboard
- Green/red price movement indication
- Basic WebSocket validation and error handling

### Data Source

The current version intentionally uses **mock stock data**, which is one of the data-source options specified in the internship project requirements.

Advanced alternatives such as a real financial API and a React frontend are outside the required scope of this implementation.

---

## ✅ Project Status

**Completed**

Photon successfully demonstrates a real-time stock ticker in which simulated stock-price data is generated by the Python backend and delivered to subscribed browser clients through WebSockets without requiring a page refresh.

---

## 🏢 Internship Information

This project was developed as part of an internship at:

**Infyntrek Systèmes**

### Internship Team

- **Tuhin Roy** — Team Lead
- **Manish Gowda** — Team Member

---

## 📄 Project Summary

**Photon — Real-Time WebSocket Stock Ticker** demonstrates the practical use of asynchronous programming and WebSocket communication to build a real-time web application.

The project connects a Python/FastAPI backend with an HTML/CSS/JavaScript frontend and provides a simple, functional real-time stock dashboard suitable for demonstrating WebSocket-based data streaming.
