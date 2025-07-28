
import api from "../connection";
import { getCurrentUser } from "../utils/getLocalUser";

import type { NavigateFunction } from "react-router-dom";
import { handleLogout } from "../utils/handleLogout";
import axios from "axios";



type SendMailResponse = {
    success: boolean;
    message: string;
};
const sendMail = async (
    subject: string,
    body: string,
    navigate: NavigateFunction,
    file?: File
): Promise<SendMailResponse | null> => {
    const user = getCurrentUser();
    if (!user) {
        handleLogout(undefined, undefined, navigate);
        return null;
    }

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("body", body);
    if (file) {
        formData.append("file", file);
    }

    try {
        const response = await api.post<SendMailResponse>(
            `api/Message/SendMail`,
            formData,

        );
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response?.data) {
            return error.response.data as SendMailResponse;
        }

        return {
            success: false,
            message: "Beklenmeyen bir hata oluştu.",
        };
    }
};

export default sendMail
