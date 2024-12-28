import { AxiosInstance } from "axios";
import { Case } from "../types/Case";
import { API_CONFIG } from "../config/api-config"

const API_URL = `${API_CONFIG.baseUrl}/cases`;

const getAllCases = (axios: AxiosInstance) => {
    return axios.get<Case[]>(API_URL);
};

const getCasesByClientId = (axios: AxiosInstance, clientId: string) => {
    return axios.get<Case[]>(`${API_URL}?clientId=${clientId}`);
}

const createCase = (axios: AxiosInstance, data: Case) => {
    return axios.post<Case>(API_URL, data);
};

const deleteCase = (axios: AxiosInstance, id: string) => {
    return axios.delete(`${API_URL}/${id}`);
};

const getCaseById = (axios: AxiosInstance, id: string) => {
    return axios.get<Case>(`${API_URL}/${id}`);
};

export default {
    getAllCases,
    getCasesByClientId,
    createCase,
    deleteCase,
    getCaseById,
};
