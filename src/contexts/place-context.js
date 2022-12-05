import { createContext, useState } from "react";

export const PlaceContext = createContext();

/*
    This context exists so that all the nested components within
    the PlaceDetails page can access and update the Place 
    data when needed.
*/
export function PlaceProvider({ children }) {
    const [place, setPlace] = useState(null);

    const contextValue = {
        setPlace,
        place
    }

    return (
        <PlaceContext.Provider value={contextValue}>
            {children}
        </PlaceContext.Provider>
    )
}

