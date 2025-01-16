import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState({});

    useEffect(() => {
        const authData = localStorage.getItem('auth');
        if (authData) {
        const authObject = JSON.parse(authData);
        setAuth(authObject)
        }
      }, []); 

    return (
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;