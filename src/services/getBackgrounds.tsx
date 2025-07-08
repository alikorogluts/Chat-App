import axios from "axios";
import { apiConfig } from "../connection";

interface Backgrounds {
    lightModeBackground?: string;
    darkModeBackground?: string;
}

const getBackgrounds = async (): Promise<Backgrounds | null> => {
    try {
        const response = await axios.get(
            apiConfig.connectionString + "Message/GetBackground",
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );

        const data = response.data;

        return {
            lightModeBackground: data.lightMode,
            darkModeBackground: data.darkMode,
        };
    } catch (error) {
        console.error("Backgrounds API hatası:", error);
        return null;
    }
};

export default getBackgrounds;
