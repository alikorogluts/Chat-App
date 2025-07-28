import api from "../connection";

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
    const response = await api.post(
        'api/Account/Register',
        {
            password,
            userName,
            email,
            code
        }

    );

    return response.data as RegisterResponse;
};
