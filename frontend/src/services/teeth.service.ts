import { AxiosInstance } from "axios";
import { API_CONFIG } from "../config/api-config"
import { Tooth } from "@/types/Tooth";

const API_URL = `${API_CONFIG.baseUrl}/teeth`;

const updateTooth = (axios: AxiosInstance, id: string, tooth: Tooth) => {
    return axios.put<Tooth>(`${API_URL}/${id}`, tooth);
}

export default {
    updateTooth
};
