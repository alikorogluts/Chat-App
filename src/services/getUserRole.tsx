import api from "../connection";

export const getUserRole = async (): Promise<boolean> => {
    try {
        const response = await api.get("api/Account/GetUserRole", {

        });

        const role = response.data?.role?.toLowerCase();

        return role === "admin"; // Admin ise true döner
    } catch (error) {
        console.error("Rol kontrolü sırasında hata:", error);
        return false; // Her durumda false döner (Unauthorized, NotFound vs.)
    }
};
