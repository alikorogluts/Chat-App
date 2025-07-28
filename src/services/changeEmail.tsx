import axios from "axios";
import api from "../connection";
import { getCurrentUser } from "../utils/getLocalUser";
import { handleLogout } from "../utils/handleLogout";
import type { NavigateFunction } from "react-router-dom";

type ChangeEmailRequest = {
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
        handleLogout(undefined, undefined, navigate);
        return {
            success: false,
            message: "Oturum süresi doldu. Lütfen tekrar giriş yapın.",
        };
    }

    const requestBody: ChangeEmailRequest = {
        password,
        newEmail,
        code,
    };

    try {
        const response = await api.put<ChangeEmailResponse>(
            `$api/Account/ChangeEmail`,
            requestBody,

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
