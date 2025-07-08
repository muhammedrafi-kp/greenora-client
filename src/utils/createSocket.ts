import { io, Socket } from "socket.io-client";

export function createSocketConnection(
  url: string,
  options?: Parameters<typeof io>[1]
): Socket {
  return io(url, {
    autoConnect: false,
    ...options,
  });
}
