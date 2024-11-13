import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth() as any;

  const logout = async () => {
    try {
      await axios.post("/revoke", {}, { withCredentials: true });
      setAuth({});
    } catch (error: any) {
      console.error("Error in logging out.", error);
      return Promise.reject(error);
    }
  };

  return logout;
};

export default useLogout;
