import { API_CONFIG } from "@/config/api-config";
import { Case } from "@/types/Case";
import { AxiosInstance } from "axios";

const API_URL = `${API_CONFIG.baseUrl}/combine`;

const getAiAnalysis = (axios: AxiosInstance, formData: FormData) => {
    return axios.post<Case>(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
}

export default {
    getAiAnalysis
};