import { Outlet } from "react-router-dom";
import { QueueProvider } from "../contexts/queue-context";

function QueueWrapper() {
    return (
        <QueueProvider>
            <Outlet />
        </QueueProvider>
    )
}

export default QueueWrapper;