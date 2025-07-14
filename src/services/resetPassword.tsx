import axios from "axios";
import { apiConfig } from "../connection";

type ResetPasswordRequest = {
    email: string;
    code: string;
};

type ResetPasswordResponse = {
    success: boolean;
    message: string;
};

const ResetPassword = async (
    email: string,
    code: string
): Promise<ResetPasswordResponse> => {
    const requestBody: ResetPasswordRequest = {
        email,
        code
    };

    const response = await axios.post<ResetPasswordResponse>(
        apiConfig.connectionString + "api/Account/ResetPassword",
        requestBody,
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*"
            }
        }
    );

    console.log("API isteği başarılı:", response.data);
    return response.data;
};

export default ResetPassword;
