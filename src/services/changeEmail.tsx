import axios from "axios";
import { apiConfig } from "../connection";
import { getCurrentUser } from "../utils/getLocalUser";
import { logout } from "../utils/logout";
import type { NavigateFunction } from "react-router-dom";

type ChangeEmailRequest = {
    userId: number;
    password: string;
    newEmail: string;
    code: string;
};

type ChangeEmailResponse = {
    success: boolean;
    message: string;
};

const changeEmail = async (
    password: string,
    newEmail: string,
    navigate: NavigateFunction,
    code: string
): Promise<ChangeEmailResponse> => {
    const user = getCurrentUser();
    if (!user) {
        logout(navigate);
        return {
            success: false,
            message: "Oturum süresi doldu. Lütfen tekrar giriş yapın.",
        };
    }

    const requestBody: ChangeEmailRequest = {
        userId: user.id,
        password,
        newEmail,
        code,
    };

    try {
        const response = await axios.put<ChangeEmailResponse>(
            `${apiConfig.connectionString}api/Account/ChangeEmail`,
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
        if (axios.isAxiosError(error)) {
            return error.response?.data ?? {
                success: false,
                message: error.message,
            };
        }

        return {
            success: false,
            message: "Bilinmeyen bir hata oluştu.",
        };
    }
};

export default changeEmail;
