import type { NavigateFunction } from "react-router-dom";
import api from "../../../../connection";
import { handleLogout } from "../../../../utils/handleLogout";
import type { ApiUsersResponse } from "../../type/UsersTypes";

const getUsers = async (navigate: NavigateFunction): Promise<ApiUsersResponse | null> => {
    try {
        const response = await api.get<ApiUsersResponse>("api/Admin/GetUsers");
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 403) {
            handleLogout(undefined, undefined, navigate);
        }
        return null;
    }
};

export default getUsers;
