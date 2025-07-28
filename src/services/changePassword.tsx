import axios from "axios";
import api from "../connection";
import { getCurrentUser } from "../utils/getLocalUser";
import { handleLogout } from "../utils/handleLogout";
import type { NavigateFunction } from "react-router-dom";

type ChangePasswordRequest = {
    oldPassword: string;
    newPassword: string;
};

type ChangePasswordResponse = {
    success: boolean;
    message: string;
};

const changePassword = async (

    oldPassword: string,
    newPassword: string,
    navigate: NavigateFunction
): Promise<ChangePasswordResponse | null> => {
    const user = getCurrentUser();
    if (!user) {
        handleLogout(undefined, undefined, navigate);
        return null;
    }

    const requestBody: ChangePasswordRequest = {
        oldPassword,
        newPassword,
    };

    try {
        const response = await api.put<ChangePasswordResponse>(
            `api/Account/ChangePassword`,
            requestBody,

        );
        return response.data;
    }
    catch (error: any) {
        // Axios hatasıysa response.data'yı döndür, değilse message
        if (axios.isAxiosError(error)) {
            return error.response?.data ?? { success: false, message: error.message };
        }
        return { success: false, message: "Bilinmeyen bir hata oluştu." };
    }

};

export default changePassword;
