import { useState, useCallback } from "react";
import axios from "axios";
import type { Message } from "../Models/types";
import { apiConfig } from "../connection";

export interface MessageItem {
    messageId: number;
    text: string;
    sendTime: string;
    isRead: boolean;
    senderId: number;
    receiverId: number;
}

export function getMessages() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMessages = useCallback(async (senderId: number, receiverId: number) => {
        setIsLoading(true);
        try {
            const response = await axios.get(apiConfig.connectionString + `Message/GetMessage`, {
                params: { senderId, receiverId },
                withCredentials: true,
            });
            const data = response.data as MessageItem[];

            // burada ChatPanel uyumlu tip
            const converted: Message[] = data.map((m) => ({
                id: m.messageId,
                senderId: m.senderId,
                receiverId: m.receiverId,
                content: m.text,
                timestamp: m.sendTime,
                isRead: m.isRead
            }));

            setMessages(converted);
        } catch (error) {
            console.error("Error fetching messages", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { messages, isLoading, fetchMessages };
}

