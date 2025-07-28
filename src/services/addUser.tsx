import api from "../connection";
import type { User } from "../Models/types";
import type { NavigateFunction } from "react-router-dom";
import { handleLogout } from "../utils/handleLogout";

interface ApiUserResponse {
    userId: number;
    username: string;
    isOnline: boolean;
    email?: string;
    role?: string;
}

const getUser = async (
    searchingId: string,
    navigate: NavigateFunction
): Promise<User | null> => {
    try {
        const response = await api.get<ApiUserResponse>('api/Account/GetUser', {
            params: { searchingId },
        });

        const data = response.data;

        return {
            id: data.userId,
            username: data.username,
            isOnline: data.isOnline ?? false,
            email: data.email ?? '',
        };
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            handleLogout(undefined, undefined, navigate);
        }
        return null;
    }
};

export default getUser;
