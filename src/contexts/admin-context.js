import { createContext, useState } from "react";

export const AdminContext = createContext();

/*
    This context exists so that all the nested components within
    the AdminDetails page can access and update the Admin 
    data when needed.
*/
export function AdminProvider({ children }) {
    const [admin, setAdmin] = useState(null);

    const contextValue = {
        setAdmin,
        admin
    }

    return (
        <AdminContext.Provider value={contextValue}>
            {children}
        </AdminContext.Provider>
    )
}

