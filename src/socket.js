// socket.js
import { io } from "socket.io-client";

const socket = io("https://studygames-backend-80244932095.us-central1.run.app", {
  transports: ["websocket"], 
  withCredentials: true,    
});

export default socket;