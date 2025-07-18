import axios from 'axios';
import { apiConfig } from '../connection';

export interface RegisterResponse {
    message: string;
    userId: string;
    userName: string;

    success: boolean;
}

export const registerApi = async (

    password: string,
    userName: string,
    email: string,
    code: string
): Promise<RegisterResponse> => {
    const response = await axios.post(
        apiConfig.connectionString + 'api/Account/Register',
        {
            password,
            userName,
            email,
            code
        },
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*"
            }
        }
    );

    return response.data as RegisterResponse;
};
