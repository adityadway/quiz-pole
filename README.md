# Live Polling System

A real-time polling application built with React and Socket.IO for interactive classroom sessions.

## Features

- **Teacher Dashboard**: Create polls, view live results, manage students
- **Student Interface**: Join sessions, answer polls, see real-time results
- **Live Chat**: Communication between teachers and students
- **Kick Functionality**: Teachers can remove students from sessions
- **Poll History**: View past polls and results

## Tech Stack

**Frontend**: React, Vite, Socket.IO Client  
**Backend**: Node.js, Express, Socket.IO  
**Styling**: Vanilla CSS

## Local Setup

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd quiz-pole
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

### Running Locally

1. Start the server (from `server` directory)
```bash
npm start
```
Server runs on `http://localhost:3000`

2. Start the client (from `client` directory)
```bash
npm run dev
```
Client runs on `http://localhost:5173`

## Deployment

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your repository
4. Set build command: `cd server && npm install`
5. Set start command: `cd server && npm start`
6. Add environment variable: `PORT=3000`

### Frontend (Vercel)
1. Push code to GitHub
2. Import project on Vercel
3. Set root directory: `client`
4. Framework preset: Vite
5. Add environment variable: `VITE_SOCKET_URL=<your-render-backend-url>`

## Environment Variables

### Client (.env)
```
VITE_SOCKET_URL=http://localhost:3000
```

### Server (.env)
```
PORT=3000
CLIENT_URL=http://localhost:5173
```

## Usage

1. **Teacher**: Select "I'm a Teacher" → Create a poll
2. **Student**: Select "I'm a Student" → Enter name → Answer poll
3. **Results**: View live results as students submit answers
4. **Chat**: Click chat button to communicate
5. **Manage**: Teachers can kick students from Participants tab

## Project Structure

```
quiz-pole/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── assets/
│   └── package.json
└── server/          # Node.js backend
    ├── index.js
    ├── socket.js
    ├── poll.js
    └── package.json
```

## License

MIT
