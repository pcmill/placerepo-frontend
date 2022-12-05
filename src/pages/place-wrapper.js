import { Outlet } from "react-router-dom";
import { PlaceProvider } from "../contexts/place-context";

function PlaceWrapper() {
    return (
        <PlaceProvider>
            <Outlet />
        </PlaceProvider>
    )
}

export default PlaceWrapper;