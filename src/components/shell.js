import { Outlet, ScrollRestoration } from "react-router-dom";
import Sidebar from "./sidebar";
import Topbar from "./topbar";

function Shell(props) {
    return (
        <>
            <div>
                <Sidebar />

                <div className="flex flex-col md:pl-64">
                    <Topbar />

                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>

            <ScrollRestoration />
        </>
    )
}

export default Shell;