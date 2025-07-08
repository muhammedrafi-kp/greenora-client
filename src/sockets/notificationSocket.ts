import { Socket } from "socket.io-client";
import { createSocketConnection } from "../utils/createSocket";

const NOTIFICATION_SOCKET_URL = import.meta.env.VITE_NOTIFICATION_SERVICE_URL || "http://localhost:6000";
const notificationSocket: Socket = createSocketConnection(NOTIFICATION_SOCKET_URL);

export default notificationSocket;
