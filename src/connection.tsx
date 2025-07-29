interface conncectionApi {
    connectionString: string
}
export const apiConfig: conncectionApi = {
    connectionString: "https://localhost:7223/"
    // connectionString: "https://chat-app1.runasp.net/"

};
import axios from 'axios';


const api = axios.create({
    baseURL: apiConfig.connectionString,
    withCredentials: true,
});

export default api;
