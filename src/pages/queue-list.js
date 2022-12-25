import { useContext, useEffect } from "react";
import PageLayout from "../components/page-layout";
import { QueueContext } from "../contexts/queue-context";

function QueueList() {
    const { queue, setQueue } = useContext(QueueContext);

    useEffect(() => {
        const fetchQueue = async () => {
            const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/queue`);

            const q = await data.json();
            console.log(q);
            setQueue(q);
        }

        fetchQueue();
    }, []);

    if (queue && queue.length > 0) {
        return (
            <PageLayout>
                <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                    Queue
                </h2>

                <div className="mt-4 overflow-hidden bg-white shadow sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {queue.map((q) => (
                            <li key={q.id} className="p-4">
                                <div className="flex space-x-3">
                                    <img className="h-6 w-6 rounded-full" src={`${q.github_avatar}&size=64`} alt={q.github_user_name} />
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium">{q.github_user_name}</h3>
                                            <p className="text-sm text-gray-500">{q.created}</p>
                                        </div>

                                        <p className="text-sm text-gray-500">
                                            {q.request_type}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </PageLayout>
        );
    } else {
        return null;
    }
}

export default QueueList;