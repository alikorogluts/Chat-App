import type { NavigateFunction } from "react-router-dom";
import { getCurrentUser } from "../utils/getLocalUser";
import axios from "axios";
import api, { apiConfig } from "../connection";
import { handleLogout } from "../utils/handleLogout";

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
        handleLogout(undefined, undefined, navigate);
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
        const response = await api.put<updateMessageResponse>(
            `${apiConfig.connectionString}api/Message/UpdateMessage`,
            requestBody


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