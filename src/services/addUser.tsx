import axios from "axios";
import { apiConfig } from "../connection";
import type { User } from "../Models/types";

interface ApiUserResponse {
    userId: number;
    username: string;
    isOnline: boolean; // API bunu döndürüyor ama değilse default veririz
}

const getUser = async (searchingId: string): Promise<User | null> => {
    try {
        const response = await axios.get<ApiUserResponse>(
            apiConfig.connectionString + "Account/GetUser",
            {
                params: { userId: searchingId },
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "*/*",
                },
            }
        );

        const data = response.data;

        return {
            id: data.userId,
            username: data.username,
            isOnline: data.isOnline ?? false, // isOnline API'de varsa al, yoksa false
        };
    } catch (error) {
        console.error("Kullanıcı getirilemedi:", error);
        return null;
    }
};

export default getUser;
