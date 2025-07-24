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
            { email, type },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response.data as SendCodeResponse;
    } catch (error: any) {
        // Axios hatasıysa response.data'yı döndür, değilse message
        if (axios.isAxiosError(error)) {
            return error.response?.data ?? { success: false, message: error.message };
        }
        return { success: false, message: "Bilinmeyen bir hata oluştu." };
    }
};

export default sendCode;
