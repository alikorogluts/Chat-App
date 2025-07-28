import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import type { Message } from "../Models/types";
import type { InboxItem } from "../Models/ApiResponse";
import { apiConfig } from "../connection";
import type { NavigateFunction } from "react-router-dom";
import { getCurrentUser } from "../utils/getLocalUser";
import playNotificationSound from "../utils/playNotificationSound";
import { handleLogout } from "../utils/handleLogout";

export const useSignalR = (
    userId: string,
    onReceiveMessage: (message: Message) => void,
    setInboxList: React.Dispatch<React.SetStateAction<InboxItem[]>>,
    navigate: NavigateFunction,
    updateOrDeleteMessage: (messageId: number, newText?: string) => void,

) => {
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    const user = getCurrentUser();
    if (!user) {
        handleLogout(undefined, undefined, navigate);
        return null;
    }

    useEffect(() => {
        if (!userId) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(apiConfig.connectionString + "chatHub", {
                withCredentials: true // Cookie’lerin gönderilmesi için
                // accessTokenFactory yok çünkü token cookie’de
            })
            .withAutomaticReconnect()
            .build();


        connection.on("ReceiveMessage", (message: Message) => {
            playNotificationSound("coming");
            console.log("gelen mesaj");
            console.log(message);
            onReceiveMessage(message);
        });

        connection.on("ReceiveDeletedMessage", (messageId: number) => {

            if (messageId) updateOrDeleteMessage(messageId);
        });

        connection.on(
            "ReceiveUpdatedMessage",
            (updatedMessage: {
                messageId: number;
                text: string;
                sendTime: string;
            }) => {
                if (updatedMessage) updateOrDeleteMessage(updatedMessage.messageId, updatedMessage.text);
            }
        );

        connection
            .start()
            .catch((err) => console.error("SignalR connection error:", err));

        connectionRef.current = connection;

        return () => {
            connection.stop();
        };
    }, [userId, onReceiveMessage, updateOrDeleteMessage, setInboxList]);
};
