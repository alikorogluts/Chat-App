import axios from "axios";
import type { loginRequest } from "../Models/ApiRequest";
import type { loginResponse } from "../Models/ApiResponse";
import { apiConfig } from "../connection";

const login = async (data: loginRequest): Promise<loginResponse> => {


    const response = await axios.post<loginResponse>(
        apiConfig.connectionString + "api/Account/Login",
        data,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*"
            }
        }
    );
    return response.data;
};

export default login;
