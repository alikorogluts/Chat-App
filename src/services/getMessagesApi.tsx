import { useState, useCallback } from "react";
import type { Message } from "../Models/types";
import api, { apiConfig } from "../connection";
import { getCurrentUser } from "../utils/getLocalUser";
import { handleLogout } from "../utils/handleLogout";
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

    const fetchMessages = useCallback(async (senderId: number) => {
        const user = getCurrentUser();

        if (!user) {
            handleLogout(undefined, undefined, navigate);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.get(`api/Message/GetMessage`, {
                params: { senderId }

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
                handleLogout(undefined, undefined, navigate);
            } else {
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    return { messages, isLoading, fetchMessages };
}
