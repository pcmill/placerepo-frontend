import { createContext, useState } from "react";

export const AuthContext = createContext();

/*
    This context saves the auth token from Github so that it can be
    used by all the nested components.
*/
export function AuthProvider({ children }) {
    const local = localStorage.getItem('user');
    const [user, setUser] = useState(JSON.parse(local));

    function logout() {
        localStorage.removeItem('user');
        setUser(null);
    }

    const contextValue = {
        setUser,
        user,
        logout
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}
