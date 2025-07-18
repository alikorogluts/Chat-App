import axios from "axios";
import { apiConfig } from "../connection";

type VerificationType = 0 | 1 | 2;



type SendCodeResponse = {
    success: boolean;
    message: string;
};

const sendCode = async (
    email: string,
    type: VerificationType
): Promise<SendCodeResponse> => {
    try {
        const response = await axios.post(
            apiConfig.connectionString + "api/Account/SendCode",
            { email, type }, // request body
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data as SendCodeResponse;
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data || error.message
        };
    }
};

export default sendCode;
