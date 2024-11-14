import { AxiosInstance } from "axios";
import { Case } from "../types/Case";

const API_URL = `${import.meta.env.VITE_REACT_APP_SERVER_URL}/cases`;

const getAllCases = (axios: AxiosInstance) => {
    return axios.get<Case[]>(API_URL);
};

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
    createCase,
    deleteCase,
    getCaseById,
};
