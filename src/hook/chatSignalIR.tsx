// hooks/useSignalR.ts
import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import type { Message } from "../Models/types";

export const useSignalR = (
    userId: string,
    onReceiveMessage: (message: Message) => void
) => {
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    useEffect(() => {
        if (!userId) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`https://localhost7223/chatHub?userId=${userId}`)
            .withAutomaticReconnect()
            .build();

        connection.on("ReceiveMessage", (message: Message) => {
            console.log("Mesaj alındı:", message);
            onReceiveMessage(message);
        });

        connection
            .start()
            .then(() => console.log("SignalR bağlantısı kuruldu"))
            .catch(err => console.error("SignalR bağlantısı hatası:", err));

        connectionRef.current = connection;

        return () => {
            connection.stop();
        };
    }, [userId, onReceiveMessage]);
};
