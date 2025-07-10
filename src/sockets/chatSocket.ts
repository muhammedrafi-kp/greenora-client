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

import { io, Socket } from "socket.io-client";

const CHAT_SOCKET_URL = import.meta.env.VITE_API_GATEWAY_URL; 

export const createSocketConnection = (url: string): Socket => {
  return io(url, {
    path: "/chat/socket.io",
    withCredentials: true,
    transports: ["websocket"],
    secure: true,
  });
};

const chatSocket: Socket = createSocketConnection(CHAT_SOCKET_URL);
export default chatSocket;