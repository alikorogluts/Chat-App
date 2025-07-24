import type { NavigateFunction } from "react-router-dom";
import { getCurrentUser } from "../utils/getLocalUser";
import { logout } from "../utils/logout";
import axios from "axios";
import { apiConfig } from "../connection";

type deleteMessageResponse = {
    success: boolean
    message: string
};

const deleteMessage = async (
    messageId: number,
    navigate: NavigateFunction
): Promise<deleteMessageResponse> => {

    const user = getCurrentUser();
    if (!user) {
        logout(navigate);
        return {
            success: false,
            message: "Oturum süresi doldu. Lütfen tekrar giriş yapın."
        }
    }
    try {
        const response = await axios.delete(apiConfig.connectionString + `api/Message/DeleteMessage`, {
            params: { messageId },
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        });
        return response.data;
    }
    catch (error: any) {
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