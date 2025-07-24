import axios from "axios";
import { apiConfig } from "../connection";

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

    const response = await axios.put<resetPasswordResponse>(
        apiConfig.connectionString + "api/Account/ResetPassword",
        requestBody,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*"
            }
        }
    );

    return response.data;
};

export default resetPassword;
