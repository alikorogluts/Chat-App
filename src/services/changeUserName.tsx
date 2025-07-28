import axios from "axios";
import api from "../connection";
import { getCurrentUser } from "../utils/getLocalUser";
import { handleLogout } from "../utils/handleLogout";
import type { NavigateFunction } from "react-router-dom";

type ChangeUserNameRequest = {
    newUserName: string;
    password: string;
};

type ChangeUserNameResponse = {
    success: boolean;
    message: string;
};

const changeUserName = async (
    newUserName: string,
    password: string,
    navigate: NavigateFunction
): Promise<ChangeUserNameResponse> => {
    const user = getCurrentUser();
    if (!user) {
        handleLogout(undefined, undefined, navigate);
        return {
            success: false,
            message: "Oturum süresi doldu. Lütfen tekrar giriş yapın.",
        };
    }

    const requestBody: ChangeUserNameRequest = {
        password,
        newUserName,
    };

    try {
        const response = await api.put<ChangeUserNameResponse>(
            `api/Account/ChangeUserName`,
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

export default changeUserName;
