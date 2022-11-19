import { createContext, useState } from "react";

export const CountryContext = createContext();

/*
    This context exists so that all the nested components within
    the CountryDetails page can access and update the country 
    data when needed.
*/
export function CountryProvider({ children }) {
    const [country, setCountry] = useState(null);

    const contextValue = {
        setCountry,
        country
    }

    return (
        <CountryContext.Provider value={contextValue}>
            {children}
        </CountryContext.Provider>
    )
}

