import { isTokenExpired } from "./isTokenExpired";
import type { User } from "../Models/types";

export const getCurrentUser = (): User | null => {
    try {
        const storedUser =
            localStorage.getItem("user") || sessionStorage.getItem("user");

        if (!storedUser) return null;

        const user = JSON.parse(storedUser);

        if (
            user &&
            user.id &&
            user.username &&
            user.token &&
            !isTokenExpired(user.token)
        ) {
            return user;
        }

        return null;
    } catch (error) {
        return null;
    }
};
