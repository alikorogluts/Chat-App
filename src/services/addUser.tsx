import axios from "axios";
import { apiConfig } from "../connection";
import type { User } from "../Models/types";
import type { NavigateFunction } from "react-router-dom";
import { getCurrentUser } from "../utils/getLocalUser";
import { logout } from "../utils/logout";

interface ApiUserResponse {
    userId: number;
    username: string;
    isOnline: boolean;
}

const getUser = async (
    searchingId: string,
    navigate: NavigateFunction
): Promise<User | null> => {
    const user = getCurrentUser();

    if (!user) {
        logout(navigate);
        return null;
    }

    try {
        const response = await axios.get<ApiUserResponse>(
            apiConfig.connectionString + "api/Account/GetUser",
            {
                params: { userId: searchingId },
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }
        );

        const data = response.data;

        return {
            id: data.userId,
            username: data.username,
            isOnline: data.isOnline ?? false,
            token: user.token
        };
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            logout(navigate);
        }
        return null;
    }
};

export default getUser;
