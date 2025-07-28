import type { NavigateFunction } from "react-router-dom";
import api from "../../../../connection";
import { handleLogout } from "../../../../utils/handleLogout";
import toast from "react-hot-toast";

interface ApiSaveResultMessage {
    success: boolean,
    message: string,
    id: number
}
const addBackground = async (

    mobileUrl: string,
    webUrl: string,
    navigate: NavigateFunction
): Promise<ApiSaveResultMessage | null> => {

    try {
        const response = await api.post<ApiSaveResultMessage>(
            "api/Admin/addBackground",
            {}, // boş body
            {
                params: {

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

export default addBackground;
