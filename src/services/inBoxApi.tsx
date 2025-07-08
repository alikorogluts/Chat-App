// src/services/messageApi.ts
import axios from "axios";
import type { InboxItem } from "../Models/ApiResponse";

import { apiConfig } from "../connection";



export const fetchInbox = async (userId: number): Promise<InboxItem[]> => {
    if (!userId) return [];

    try {
        const response = await axios.get(
            apiConfig.connectionString + `Message/GetInbox`,
            {
                params: { receiverId: userId },
                withCredentials: true,
                headers: { Accept: "*/*" },
            }
        );

        return response.data.map((item: any) => ({
            senderId: item.contactId,
            senderUsername: item.contactUsername,
            senderOnline: item.contactOnline ?? false,
            lastMessage: item.lastMessage,
            sendTime: item.sendTime,
            isRead: item.isRead,
            unreadCount: item.unreadCount ?? 0,
        }));
    } catch (error: any) {
        console.error(
            "Error fetching inbox:",
            error.response?.data || error.message || error
        );
        return [];
    }
};