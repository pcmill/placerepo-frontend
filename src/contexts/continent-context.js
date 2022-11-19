import { createContext, useState } from "react";

export const ContinentContext = createContext();

/*
    This context exists so that all the nested components within
    the ContinentDetails page can access and update the continent 
    data when needed.
*/
export function ContinentProvider({ children }) {
    const [continent, setContinent] = useState(null);

    const contextValue = {
        setContinent,
        continent
    }

    return (
        <ContinentContext.Provider value={contextValue}>
            {children}
        </ContinentContext.Provider>
    )
}

