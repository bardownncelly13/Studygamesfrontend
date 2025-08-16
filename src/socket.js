// socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
  transports: ["websocket"] // force WebSocket, avoid slow polling fallback
});
export default socket;