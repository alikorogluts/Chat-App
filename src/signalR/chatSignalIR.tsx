// hooks/useSignalR.ts
import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import type { Message } from "../Models/types";
import type { InboxItem } from "../Models/ApiResponse";
import { apiConfig } from "../connection";
import type { NavigateFunction } from "react-router-dom";
import { getCurrentUser } from "../utils/getLocalUser";
import { logout } from "../utils/logout";


export const useSignalR = (
    userId: string,
    onReceiveMessage: (message: Message) => void,
    setInboxList: React.Dispatch<React.SetStateAction<InboxItem[]>>,
    navigate: NavigateFunction
) => {
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    const user = getCurrentUser();

    if (!user) {
        logout(navigate);
        return null;
    }

    useEffect(() => {
        if (!userId) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(apiConfig.connectionString + `chatHub?userId=${userId}`, {
                accessTokenFactory: () => user.token
            })
            .withAutomaticReconnect()
            .build();

        // Kullanıcının online durumu değiştiğinde Inbox listesini güncelle
        /*  connection.on("UserStatusChanged", (changedUserId: any, isOnline: boolean) => {
              const idAsNumber = Number(changedUserId);
              setInboxList(prev =>
                  prev.map(item =>
                      item.senderId === idAsNumber
                          ? { ...item, senderOnline: isOnline }
                          : item
                  )
              );
              console.log("Durum değişti:", idAsNumber, isOnline);
          });*/



        // Mesaj alındığında tetiklenir
        connection.on("ReceiveMessage", (message: Message) => {
            onReceiveMessage(message);
        });

        connection
            .start();


        connectionRef.current = connection;

        return () => {
            connection.stop();
        };
    }, [userId, onReceiveMessage, setInboxList]);
};
