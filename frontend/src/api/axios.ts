import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_SERVER_URL,
});

export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_SERVER_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
