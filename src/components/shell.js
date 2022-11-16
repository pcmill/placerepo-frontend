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

                    <main className="flex-1 py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>

            <ScrollRestoration />
        </>
    )
}

export default Shell;