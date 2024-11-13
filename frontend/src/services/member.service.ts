import { AxiosInstance } from "axios";
import { Member } from "../types/member";

const API_URL = `${import.meta.env.VITE_REACT_APP_SERVER_URL}/members`;

const getAllMembers = (axios: AxiosInstance, sorted: boolean) => {
  if (sorted) {
    return axios.get<Member[]>(`${API_URL}?sort=birthday`);
  }
  return axios.get<Member[]>(API_URL);
};

const getSortedMembers = (axios: AxiosInstance) => {
  return axios.get<Member[]>(`${API_URL}/sorted`);
};

const createMember = (axios: AxiosInstance, data: Member) => {
  return axios.post<Member>(API_URL, data);
};

const deleteMember = (axios: AxiosInstance, id: string) => {
  return axios.delete(`${API_URL}/${id}`);
};

const getMemberById = (axios: AxiosInstance, id: string) => {
  return axios.get<Member>(`${API_URL}/${id}`);
};

const editMember = (axios: AxiosInstance, id: string, data: Member) => {
  return axios.put<Member>(`${API_URL}/${id}`, data);
};

const getMembersWithBirthdaysToday = (axios: AxiosInstance) => {
  return axios.get<Member[]>(`${API_URL}/birthday`);
};

export default {
  getAllMembers,
  getSortedMembers,
  createMember,
  deleteMember,
  getMemberById,
  editMember,
  getMembersWithBirthdaysToday,
};
