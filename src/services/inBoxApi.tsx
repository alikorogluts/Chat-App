import axios from "axios";
import type { InboxItem } from "../Models/ApiResponse";
import { apiConfig } from "../connection";
import { getCurrentUser } from "../utils/getLocalUser";
import { logout } from "../utils/logout";
import type { NavigateFunction } from "react-router-dom";

export const fetchInbox = async (
    userId: number,
    navigate: NavigateFunction
): Promise<InboxItem[]> => {
    const user = getCurrentUser();
    if (!user || !userId) {
        logout(navigate);
        return [];
    }

    try {
        const response = await axios.get(apiConfig.connectionString + `api/Message/GetInbox`, {
            params: { receiverId: userId },
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${user.token}`,
            },
        });

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
        if (error.response?.status === 401 || error.response?.status === 403) {
            logout(navigate);
        }
        return [];
    }
};
