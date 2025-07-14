import axios from "axios";
import { apiConfig } from "../connection";

type sendCodeResponse = {
    success: boolean;
    message: string;
};

const sendCode = async (eposta: string): Promise<sendCodeResponse> => {
    const response = await axios.get(
        apiConfig.connectionString + "api/Account/SendCode",
        {
            params: { email: eposta },

        }
    );
    console.log("Gelen yanıt", response.data);

    return response.data as sendCodeResponse;
};



export default sendCode;
