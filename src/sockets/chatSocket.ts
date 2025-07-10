// import { Socket } from "socket.io-client";
// import { createSocketConnection } from "../utils/createSocket";

// const CHAT_SOCKET_URL = import.meta.env.VITE_CHAT_SERVICE_URL || "http://localhost:5000";
// const chatSocket: Socket = createSocketConnection(CHAT_SOCKET_URL);

// export default chatSocket;


// import { io, Socket } from "socket.io-client";

// const CHAT_SOCKET_URL = import.meta.env.VITE_API_GATEWAY_URL;

// export const createSocketConnection = (url: string): Socket => {
//   return io(url, {
//     path: "/chat/socket.io", // match backend's path
//     withCredentials: true,
//     transports: ["websocket"]
//   });
// };

// const chatSocket: Socket = createSocketConnection(CHAT_SOCKET_URL);
// export default chatSocket;





// import { io, Socket } from "socket.io-client";

// const CHAT_SOCKET_URL = import.meta.env.VITE_API_GATEWAY_URL; 

// export const createSocketConnection = (url: string): Socket => {
//   return io(url, {
//     path: "/chat/socket.io",
//     withCredentials: true,
//     transports: ["websocket"],
//     secure: true,
//   });
// };

// const chatSocket: Socket = createSocketConnection(CHAT_SOCKET_URL);
// export default chatSocket;








import { io, Socket } from "socket.io-client";

// Ensure this environment variable is correctly set in your .env file
// and accessible by Vite (VITE_ prefix is correct for Vite).
const CHAT_SOCKET_URL = import.meta.env.VITE_API_GATEWAY_URL; 

export const createSocketConnection = (url: string): Socket => {
  const socket = io(url, {
    path: "/chat/socket.io",
    withCredentials: true,
    // transports: ["websocket"], // Keeping this as 'websocket' only to force the issue for debugging
    secure: true,
  });

  // --- Start of Debugging Additions ---

  // Listen for generic connection errors (e.g., DNS, network down)
  socket.on("connect_error", (err:any) => {
    console.error("Socket.IO connection error:");
    console.error("  Message:", err.message); // High-level error message
    
    // err.cause often contains the underlying network error or HTTP response
    if (err.cause) {
      console.error("  Cause:", err.cause);
      // If it's an XMLHttpRequest (polling error), you might get more details
      if (err.cause.response) {
        console.error("  Cause Response:", err.cause.response);
      }
      if (err.cause.status) {
        console.error("  Cause Status:", err.cause.status);
      }
    }
    
    // Custom error data sent from the backend (less common for basic handshake failures)
    if (err.data) {
      console.error("  Error Data:", err.data); 
    }
  });

  // Listen for disconnection events (after a successful connection or failed handshake)
  socket.on("disconnect", (reason) => {
    console.log("Socket.IO disconnected:", reason);
    // Common reasons: "io server disconnect", "io client disconnect", "ping timeout", "transport close", "transport error"
  });

  // Listen for successful connection
  socket.on("connect", () => {
    console.log("Socket.IO connected successfully!", socket.id);
  });

  // --- End of Debugging Additions ---

  return socket;
};

const chatSocket: Socket = createSocketConnection(CHAT_SOCKET_URL);
export default chatSocket;