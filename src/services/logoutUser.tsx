// logoutService.ts

import api from "../connection";

interface LogoutResponse {
    success: boolean;
    message: string;
}

export const logoutUser = async (): Promise<LogoutResponse> => {
    try {
        const response = await api.post(
            "api/Account/Logout",
            {},
            {
                withCredentials: true,
            }
        );

        return {
            success: true,
            message: response.data.message ?? "Çıkış başarılı.",
        };
    } catch (error: any) {
        return {
            success: false,
            message:
                error.response?.data?.message ??
                error.message ??
                "Bilinmeyen bir hata oluştu.",
        };
    }
};
