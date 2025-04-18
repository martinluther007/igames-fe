## Getting Started

# 🎯 iGaming Frontend

This is the React frontend for the iGaming assignment. It interacts with the backend via REST and Socket.IO to provide a real-time game experience.

---

## ✨ Features

- Login with a username
- Join an active game session
- Pick a number from (1 – 9)
- See countdown timer and player count
- Instant result feedback (win/loss)
- Display win/loss stats

---

## 🛠️ Technologies

- Next
- Axios
- Socket.IO Client

---

## 🔧 Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

```
## 🔌 Socket.IO Events

### Listened to by the frontend (via singleton `socket` instance)

| Event Name         | Description                                           |
|--------------------|-------------------------------------------------------|
| `session_start`     | Triggered when a new game session starts              |
| `session_end`       | Triggered when the session ends with results          |
| `countdown_tick`    | Sends the countdown time left in seconds              |
| `numOfPlayers`      | Number of players currently in the session            |


### Emitted by the frontend

| Event Name     | Payload                             | Description                          |
|----------------|--------------------------------------|--------------------------------------|
| `join_game`    | `{ token, name }`                  | Sent when a user joins a session
```
