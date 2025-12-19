import { io } from "socket.io-client";

// Use environment variable or default to localhost
const SERVER_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

export const socket = io(SERVER_URL);
