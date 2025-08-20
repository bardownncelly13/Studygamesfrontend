// socket.js
import { io } from "socket.io-client";

const socket = io("https://my-express-server-211542461249.us-central1.run.app", {
  transports: ["websocket"], 
  upgrade: true,  
  withCredentials: true,    
});
socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Disconnected:", reason);
});
export default socket;