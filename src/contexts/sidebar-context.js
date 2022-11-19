import { createContext, useState } from "react";

export const SidebarContext = createContext();

export default function SidebarProvider({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const contextValue = {
        changeSidebarState: (open) => {
            setSidebarOpen(open);
        },
        sidebarOpen
    }

    return (
        <SidebarContext.Provider value={contextValue}>
            {children}
        </SidebarContext.Provider>
    )
}

