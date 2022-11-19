import { Outlet } from "react-router-dom";
import { CountryProvider } from "../contexts/country-context";

function CountryWrapper() {
    return (
        <CountryProvider>
            <Outlet />
        </CountryProvider>
    )
}

export default CountryWrapper;