import { io, Socket } from "socket.io-client";

const NOTIFICATION_SOCKET_URL = import.meta.env.VITE_API_GATEWAY_URL;
// const NOTIFICATION_SOCKET_URL = import.meta.env.VITE_NOTIFICATION_SERVICE_URL;

export const createSocketConnection = (url: string): Socket => {
    return io(url, {
        path: "/notification/socket.io",
        withCredentials: true,
        // transports: ["websocket"],
        secure: true,
    });
};

const notificationSocket: Socket = createSocketConnection(NOTIFICATION_SOCKET_URL);
// const notificationSocket: Socket = createSocketConnection("");

export default notificationSocket;