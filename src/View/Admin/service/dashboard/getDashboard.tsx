import type { NavigateFunction } from "react-router-dom";
import api from "../../../../connection";
import type { ApiDashboardResponse } from "../../type/DashboardTypes";
import { handleLogout } from "../../../../utils/handleLogout";

const getDashboard = async (

    navigate: NavigateFunction
): Promise<ApiDashboardResponse | null> => {
    try {
        const response = await api.get<ApiDashboardResponse>("api/Admin/GetDashboard");

        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            handleLogout(undefined, undefined, navigate);
        }
        return null;
    }
};

export default getDashboard;
