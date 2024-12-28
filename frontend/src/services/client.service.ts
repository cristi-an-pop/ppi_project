import { AxiosInstance } from "axios";
import { Client } from "../types/client";
import { API_CONFIG } from "../config/api-config";

const API_URL = `${API_CONFIG.baseUrl}/clients`;

const getAllClients = (axios: AxiosInstance) => {
  return axios.get<Client[]>(API_URL);
};

const createClient = (axios: AxiosInstance, data: Client) => {
  return axios.post<Client>(API_URL, data);
};

const deleteClient = (axios: AxiosInstance, id: string) => {
  return axios.delete(`${API_URL}/${id}`);
};

const getClientById = (axios: AxiosInstance, id: string) => {
  return axios.get<Client>(`${API_URL}/${id}`);
};

const editClient = (axios: AxiosInstance, id: string, data: Client) => {
  return axios.put<Client>(`${API_URL}/${id}`, data);
};

export default {
  getAllClients,
  createClient,
  deleteClient,
  getClientById,
  editClient,
};
