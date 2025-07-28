import type { NavigateFunction } from "react-router-dom";
import api from "../../../../connection";
import type { ApiResultMessage } from "../../type/ApiResultMessage";
import { handleLogout } from "../../../../utils/handleLogout";
import toast from "react-hot-toast";


const updateBackground = async (
    id: number,
    mobileUrl: string,
    webUrl: string,
    navigate: NavigateFunction
): Promise<ApiResultMessage | null> => {

    try {
        const response = await api.put<ApiResultMessage>(
            "api/Admin/UpdateBackground",
            {}, // boş body
            {
                params: {
                    id,
                    mobileUrl,
                    webUrl
                },
            }
        );

        if (response.data.success) {
            toast.success(response.data.message || "Durum başarıyla güncellendi.");
        } else {
            toast.error(response.data.message || "Durum güncellenemedi.");
        }

        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            handleLogout(undefined, undefined, navigate);
        } else {
            toast.error("Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.");
        }
        return null;
    }
};

export default updateBackground;
