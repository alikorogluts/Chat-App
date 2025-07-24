import axios from "axios";
import { apiConfig } from "../connection";
import { getCurrentUser } from "../utils/getLocalUser";
import { logout } from "../utils/logout";
import type { NavigateFunction } from "react-router-dom";

type ChangeUserNameRequest = {
    userId: number;
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
        logout(navigate);
        return {
            success: false,
            message: "Oturum süresi doldu. Lütfen tekrar giriş yapın.",
        };
    }

    const requestBody: ChangeUserNameRequest = {
        userId: user.id,
        password,
        newUserName,
    };

    try {
        const response = await axios.put<ChangeUserNameResponse>(
            `${apiConfig.connectionString}api/Account/ChangeUserName`,
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

export default changeUserName;
