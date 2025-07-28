import type { NavigateFunction } from "react-router-dom";
import { getCurrentUser } from "../utils/getLocalUser";
import { handleLogout } from "../utils/handleLogout";
import axios from "axios";
import api from "../connection";

type deleteMessageResponse = {
    success: boolean;
    message: string;
};

const deleteMessage = async (
    messageId: number,
    navigate: NavigateFunction
): Promise<deleteMessageResponse> => {
    const user = getCurrentUser();
    if (!user) {
        handleLogout(undefined, undefined, navigate);
        return {
            success: false,
            message: "Oturum süresi doldu. Lütfen tekrar giriş yapın.",
        };
    }

    try {
        const response = await api.delete<deleteMessageResponse>(`api/Message/DeleteMessage`, {
            params: { messageId },
            // Eğer token header ile auth gerekiyorsa, şu satırı açabilirsin:
            // headers: { Authorization: `Bearer ${user.token}` }
        });

        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            return error.response?.data ?? {
                success: false,
                message: error.message,
            };
        }
        return {
            success: false,
            message: "Bilinmeyen bir hata oluştu",
        };
    }
};

export default deleteMessage;
