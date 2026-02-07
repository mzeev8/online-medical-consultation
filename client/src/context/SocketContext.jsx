"use client";
const { createContext, useMemo, useContext } = require("react");
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socket = useMemo(() => {
        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
            autoConnect: false,
            transports: ["websocket"],
        });

        socket.connect();

        return socket;
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
