import axios from "axios";
import { apiConfig } from "../connection";
import { getCurrentUser } from "../utils/getLocalUser";
import { logout } from "../utils/logout";
import type { NavigateFunction } from "react-router-dom";

type ChangePasswordRequest = {
    userId: number,
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
        logout(navigate);
        return null;
    }
    const userId = user.id;

    const requestBody: ChangePasswordRequest = {
        userId,
        oldPassword,
        newPassword,
    };

    try {
        const response = await axios.put<ChangePasswordResponse>(
            `${apiConfig.connectionString}api/Account/ChangePassword`,
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
