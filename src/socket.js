// socket.js
import { io } from "socket.io-client";

const socket = io("https://studygames-backend-80244932095.us-central1.run.app", {
  transports: ["websocket"], 
  withCredentials: true,    
});
socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Disconnected:", reason);
});
export default socket;