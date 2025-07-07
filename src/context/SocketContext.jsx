import { createContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

// ✅ Explicitly connect to the correct backend
const socket = io("http://localhost:5000", {
  transports: ["websocket"], // force direct websocket to avoid session mismatch
});

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={socket}>
    {children}
  </SocketContext.Provider>
);
