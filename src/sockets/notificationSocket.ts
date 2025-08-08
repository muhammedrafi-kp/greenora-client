import { io, Socket } from "socket.io-client";

export const createSocketConnection = (url: string): Socket => {
    return io(url, {
        path: "/notification/socket.io",
        withCredentials: true,
        // transports: ["websocket"],
        secure: true,
    });
};

const notificationSocket: Socket = createSocketConnection("https://api-greenora.mhdrafi.online");
export default notificationSocket;