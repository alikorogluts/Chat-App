import api from "../connection";
import { getCurrentUser } from "../utils/getLocalUser";
import { handleLogout } from "../utils/handleLogout";
import type { NavigateFunction } from "react-router-dom";

interface Backgrounds {
    mobileModeBackground?: string;
    webModeBackground?: string;
}

const getBackgrounds = async (navigate: NavigateFunction): Promise<Backgrounds | null> => {
    const user = getCurrentUser();

    if (!user) {
        handleLogout(undefined, undefined, navigate);
        return null;
    }

    try {
        const response = await api.get("api/Message/GetBackground", {

        });

        const data = response.data;


        return {
            mobileModeBackground: data.mobilMode,
            webModeBackground: data.webMode,
        };
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            handleLogout(undefined, undefined, navigate);
        }
        return null;
    }
};

export default getBackgrounds;
