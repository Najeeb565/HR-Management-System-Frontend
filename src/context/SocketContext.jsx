
import { createContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const socket = io("http://localhost:5000"); // Replace with your backend base URL

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={socket}>
    {children}
  </SocketContext.Provider>
);