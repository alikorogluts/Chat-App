// service/getComplaints.ts

import type { NavigateFunction } from "react-router-dom";
import api from "../../../../connection";
import { handleLogout } from "../../../../utils/handleLogout";
import type { ApiComplaintsResponse } from "../../type/ComplaintsTypes";

const getComplaints = async (navigate: NavigateFunction): Promise<ApiComplaintsResponse | null> => {
    try {
        const response = await api.get<ApiComplaintsResponse>("api/Admin/GetComplaints");
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            handleLogout(undefined, undefined, navigate);
        }
        return null;
    }
};

export default getComplaints;
