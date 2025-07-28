import api from "../connection";

type resetPasswordRequest = {
    email: string;
    code: string;
};

type resetPasswordResponse = {
    success: boolean;
    message: string;
};

const resetPassword = async (
    email: string,
    code: string
): Promise<resetPasswordResponse> => {
    const requestBody: resetPasswordRequest = {
        email,
        code
    };

    const response = await api.put<resetPasswordResponse>(
        "api/Account/ResetPassword",
        requestBody,

    );

    return response.data;
};

export default resetPassword;
