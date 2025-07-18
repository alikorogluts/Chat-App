import axios from "axios";
import { apiConfig } from "../connection";
import { getCurrentUser } from "../utils/getLocalUser";
import { logout } from "../utils/logout";
import type { NavigateFunction } from "react-router-dom";

interface Backgrounds {
    lightModeBackground?: string;
    darkModeBackground?: string;
}

const getBackgrounds = async (navigate: NavigateFunction): Promise<Backgrounds | null> => {
    const user = getCurrentUser();

    if (!user) {
        logout(navigate);
        return null;
    }

    try {
        const response = await axios.get(apiConfig.connectionString + "api/Message/GetBackground", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${user.token}`,
            },
        });

        const data = response.data;

        return {
            lightModeBackground: data.lightMode,
            darkModeBackground: data.darkMode,
        };
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            logout(navigate);
        }
        return null;
    }
};

export default getBackgrounds;
