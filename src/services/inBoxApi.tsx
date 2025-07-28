
import type { InboxItem } from "../Models/ApiResponse";
import { getCurrentUser } from "../utils/getLocalUser";
import { handleLogout } from "../utils/handleLogout";
import type { NavigateFunction } from "react-router-dom";
import api from "../connection";

export const fetchInbox = async (

    navigate: NavigateFunction
): Promise<InboxItem[]> => {
    const user = getCurrentUser();
    if (!user) {
        handleLogout(undefined, undefined, navigate);
        return [];
    }

    try {
        const response = await api.get(`api/Message/GetInbox`);

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
            handleLogout(undefined, undefined, navigate);
        }
        return [];
    }
};
