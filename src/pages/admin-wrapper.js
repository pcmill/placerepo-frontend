import { Outlet } from "react-router-dom";
import { AdminProvider } from "../contexts/admin-context";

function AdminWrapper() {
    return (
        <AdminProvider>
            <Outlet />
        </AdminProvider>
    )
}

export default AdminWrapper;