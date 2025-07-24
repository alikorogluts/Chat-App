import type { NavigateFunction } from "react-router-dom";
import { getCurrentUser } from "../utils/getLocalUser";
import { logout } from "../utils/logout";
import axios from "axios";
import { apiConfig } from "../connection";

type updateMessageRequest = {
    messageId: number;
    text: string;
};
type updateMessageResponse = {
    success: boolean;
    message: string;

};

const updateMessage = async (_messageId: number, _messageContent: string, navigate: NavigateFunction): Promise<updateMessageResponse> => {

    const user = getCurrentUser();
    if (!user) {
        logout(navigate);
        return {
            success: false,
            message: "Oturum süreniz doldu. Lütfen tekrar giriş yapın."
        }
    }
    const requestBody: updateMessageRequest = {
        messageId: _messageId,
        text: _messageContent,
    };

    try {
        const response = await axios.put<updateMessageResponse>(
            `${apiConfig.connectionString}api/Message/UpdateMessage`,
            requestBody,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                    Authorization: `Bearer ${user.token}`,
                },
            }

        );
        return response.data

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
            message: "Bilinmeyen bir hata oluştu.",
        }
    }


};

export default updateMessage;