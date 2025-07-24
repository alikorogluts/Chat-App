import axios from "axios";
import { apiConfig } from "../connection";
import type { MessageItem } from "./getMessagesApi";
import { getCurrentUser } from "../utils/getLocalUser";
import type { NavigateFunction } from "react-router-dom";
import { logout } from "../utils/logout";
import playNotificationSound from "../utils/playNotificationSound";

export const sendMessageApi = async (
    text: string,
    senderId: number,
    receiverId: number,
    navigate: NavigateFunction,
    file?: File,
    onProgress?: (progress: number) => void
): Promise<MessageItem | null> => {
    const user = getCurrentUser();
    if (!user) {
        logout(navigate);
        return null;
    }

    const formData = new FormData();
    formData.append("text", text ?? "");
    formData.append("senderId", senderId.toString());
    formData.append("receiverId", receiverId.toString());
    if (file) formData.append("file", file);

    try {
        const response = await axios.post(
            apiConfig.connectionString + "api/Message/SendMessageWithFile",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    if (onProgress) onProgress(percent);
                },
            }
        );

        console.log("response" + response);
        playNotificationSound("send");

        return response.data;
    } catch (error: any) {
        return null;
    }
};
