import axios from 'axios';
import { apiConfig } from '../connection';

export interface RegisterResponse {
    message: string;
    userId: string;
    userName: string;
}

export const registerApi = async (
    password: string,
    userName: string
): Promise<RegisterResponse> => {
    const response = await axios.post(
        apiConfig.connectionString + 'Account/Register',
        {
            password,
            userName,
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
