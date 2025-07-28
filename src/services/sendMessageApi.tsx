import api from "../connection";
import type { MessageItem } from "./getMessagesApi";
import { getCurrentUser } from "../utils/getLocalUser";
import type { NavigateFunction } from "react-router-dom";
import playNotificationSound from "../utils/playNotificationSound";
import { handleLogout } from "../utils/handleLogout";

export const sendMessageApi = async (
    text: string,
    receiverId: number,
    navigate: NavigateFunction,
    file?: File,
    onProgress?: (progress: number) => void
): Promise<MessageItem | null> => {
    const user = getCurrentUser();
    if (!user) {
        handleLogout(undefined, undefined, navigate);
        return null;
    }

    const formData = new FormData();
    formData.append("text", text ?? "");
    formData.append("receiverId", receiverId.toString());
    if (file) formData.append("file", file);

    try {
        const response = await api.post(
            "api/Message/SendMessageWithFile",
            formData,
            {

                onUploadProgress: (progressEvent) => {
                    const percent = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total || 1)
                    );
                    if (onProgress) onProgress(percent);
                },
            }
        );

        playNotificationSound("send");

        return response.data;
    } catch (error: any) {
        return null;
    }
};
