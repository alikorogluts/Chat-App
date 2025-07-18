import axios from "axios";
import { apiConfig } from "../connection";
import { getCurrentUser } from "../utils/getLocalUser";
import { logout } from "../utils/logout";
import type { NavigateFunction } from "react-router-dom";

type SendMailRequest = {
    userId: number,
    subject: string;
    body: string;
};

type SendMailResponse = {
    success: boolean;
    message: string;
};

const sendMail = async (

    subject: string,
    body: string,
    navigate: NavigateFunction
): Promise<SendMailResponse | null> => {
    const user = getCurrentUser();
    if (!user) {
        logout(navigate);
        return null;
    }
    const userId = user.id;

    const requestBody: SendMailRequest = {
        userId,
        subject,
        body,
    };

    try {
        const response = await axios.post<SendMailResponse>(
            `${apiConfig.connectionString}api/Message/SendMail`,
            requestBody,
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                    Authorization: `Bearer ${user.token}`,
                },
            }
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

export default sendMail;
