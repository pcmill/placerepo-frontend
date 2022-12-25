import { createContext, useState } from "react";

export const QueueContext = createContext();

/*
    This context exists so that all the nested components within
    the QueueList page can access and update the Queue 
    data when needed.
*/
export function QueueProvider({ children }) {
    const [queue, setQueue] = useState(null);

    const contextValue = {
        setQueue,
        queue
    }

    return (
        <QueueContext.Provider value={contextValue}>
            {children}
        </QueueContext.Provider>
    )
}

