import Sidebar from "../sidebar/sidebar";
import Topbar from "../topbar/topbar";

function Shell(props) {
    return (
        <>
            <div>
                <Sidebar />

                <div className="flex flex-col md:pl-64">
                    <Topbar />

                    <main className="flex-1 py-6">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                            {props.children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    )
}

export default Shell;