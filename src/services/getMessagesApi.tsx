import { useState, useCallback } from "react";
import axios from "axios";
import type { Message } from "../Models/types";
import { apiConfig } from "../connection";
import { getCurrentUser } from "../utils/getLocalUser";
import { logout } from "../utils/logout";
import type { NavigateFunction } from "react-router-dom";

export interface MessageItem {
    senderName?: string;
    messageId: number;
    text: string;
    sendTime: string;
    isRead: boolean;
    senderId: number;
    receiverId: number;
    fileUrl: string;
    fileName: string;
    ReadTime: string,
}

export function getMessages(navigate: NavigateFunction) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMessages = useCallback(async (senderId: number, receiverId: number) => {
        const user = getCurrentUser();

        if (!user) {
            logout(navigate);
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(apiConfig.connectionString + `api/Message/GetMessage`, {
                params: { senderId, receiverId },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            const data = response.data as MessageItem[];

            const converted: Message[] = data.map((m) => ({
                id: m.messageId,
                senderId: m.senderId,
                receiverId: m.receiverId,
                text: m.text,
                timestamp: m.sendTime,
                isRead: m.isRead,
                fileUrl: m.fileUrl ? apiConfig.connectionString + m.fileUrl : undefined,
            }));

            setMessages(converted);
        } catch (error: any) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                logout(navigate);
            } else {
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    return { messages, isLoading, fetchMessages };
}
