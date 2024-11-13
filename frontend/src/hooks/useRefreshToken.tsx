import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
  const { setAuth } = useAuth() as any;

  const refresh = async () => {
    try {
      const response = await axios.get("/refresh", { withCredentials: true });

      setAuth((prev: any) => {
        console.log(prev);
        console.log(response.data.accessToken);
        return {
          ...prev,
          username: response.data.username,
          role: response.data.role,
          accessToken: response.data.accessToken,
        };
      });
    } catch (error: any) {
      console.error("Error in refreshing token.", error);
      return Promise.reject(error);
    }
  };

  return refresh;
};

export default useRefreshToken;
