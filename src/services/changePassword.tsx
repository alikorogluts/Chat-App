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
        const response = await axios.post<ChangePasswordResponse>(
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
        if (axios.isAxiosError(error) && error.response?.data) {
            return error.response.data as ChangePasswordResponse;
        }

        return {
            success: false,
            message: "Beklenmeyen bir hata oluştu.",
        };
    }

};

export default changePassword;
