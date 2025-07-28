import api from "../connection"; // senin axios instance dosyan

import type { loginRequest } from "../Models/ApiRequest";
import type { loginResponse } from "../Models/ApiResponse";

const login = async (data: loginRequest): Promise<loginResponse> => {
    const response = await api.post<loginResponse>(
        "api/Account/Login",
        data,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
            },
        }
    );

    return response.data;
};

export default login;
