// service/getComplaints.ts

import type { NavigateFunction } from "react-router-dom";
import api from "../../../../connection";
import { handleLogout } from "../../../../utils/handleLogout";
import type { BackgroundImageResponse } from "../../type/backgroundsTypes";

const getBackgroundImages = async (navigate: NavigateFunction): Promise<BackgroundImageResponse | null> => {
    try {
        const response = await api.get<BackgroundImageResponse>("api/Admin/GetBackgrounds");
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            handleLogout(undefined, undefined, navigate);
        }
        return null;
    }
};

export default getBackgroundImages;
