import type { NavigateFunction } from "react-router-dom";
import api from "../../../../connection";
import type { ApiResultMessage } from "../../type/ApiResultMessage";
import { handleLogout } from "../../../../utils/handleLogout";
import toast from "react-hot-toast";


const deleteComplaints = async (
    ComplaintsId: number,
    navigate: NavigateFunction
): Promise<ApiResultMessage | null> => {
    try {
        const response = await api.delete<ApiResultMessage>("api/Admin/DeleteComplaints", {
            params: { ComplaintsId }
        });


        if (response.data.success) {
            toast.success(response.data.message || "Şikayet başarıyla silindi.");
        } else {
            toast.error(response.data.message || "Şikayet başarıyla silinemedi.");
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

export default deleteComplaints;
