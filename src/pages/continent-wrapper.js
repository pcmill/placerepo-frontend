import { Outlet } from "react-router-dom";
import { ContinentProvider } from "../contexts/continent-context";

function ContinentWrapper() {
    return (
        <ContinentProvider>
            <Outlet />
        </ContinentProvider>
    )
}

export default ContinentWrapper;