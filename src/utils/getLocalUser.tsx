import type { User } from "../Models/types";



export const getCurrentUser = (): User | null => {
    try {
        const storedUser =
            localStorage.getItem("user") || sessionStorage.getItem("user");

        if (!storedUser) return null;

        const user = JSON.parse(storedUser);

        // Token geçerli mi ve ID eşleşiyor mu?
        if (

            user.id &&
            user.username &&
            user.email
        ) {
            return user;
        }

        return null;
    } catch (error) {
        return null;
    }
};
