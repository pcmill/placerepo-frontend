import { useContext, useEffect } from "react";
import PageLayout from "../components/page-layout";
import { QueueContext } from "../contexts/queue-context";
import * as timeago from 'timeago.js';
import { AuthContext } from "../contexts/auth-context";
import MiniMap from "../components/mini-map";

function QueueList() {
    const { queue, setQueue } = useContext(QueueContext);
    const { accessToken, user } = useContext(AuthContext);

    useEffect(() => {
        const fetchQueue = async () => {
            const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/queue`);

            const q = await data.json();
            setQueue(q);
        }

        fetchQueue();
    }, [setQueue]);

    const handleStatus = async (id, status) => {
        await fetch(`${process.env.REACT_APP_BACKEND}/v1/queue/status/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                status: Number(status),
            }),
            headers: {
                'content-type': 'application/json',
                'x-access-token': accessToken                    
            }
        });

        // Remove from queue
        setQueue(queue.filter(q => q.id !== id));
    };

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
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium">{q.github_user_name}</h3>
                                            <p className="text-sm text-gray-500">{timeago.format(q.created)}</p>
                                        </div>

                                        <div className="flex items-center">
                                            {q.place_name && <p className="text-md text-gray-600">
                                                {q.place_name}
                                            </p>}

                                            {q.request.name && <p className="text-md text-gray-700">
                                                {q.request.name}
                                            </p>}
                                            
                                            <p className="ml-auto text-sm text-gray-400">
                                                {q.request_type}
                                            </p>
                                        </div>

                                        <div className="flex items-center">
                                            {q.language && <p className="mr-3 text-sm text-gray-500">{q.language}</p>}
                                            {q.admin_name && <p className="mr-3 text-sm text-gray-500">{q.admin_name}</p>}
                                            {q.country_name && <p className="text-sm text-gray-500">{q.country_name}</p>}
                                        </div>

                                        {q.request.latitude && q.request.longitude && <div className="mt-2">
                                            <MiniMap latitude={q.request.latitude} longitude={q.request.longitude} />
                                        </div>}

                                        {user.level === 2 && <div className="mt-2">
                                            <button
                                                onClick={() => handleStatus(q.id, 1)}
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => handleStatus(q.id, 2)}
                                                type="button"
                                                className="ml-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                            >
                                                Deny
                                            </button>
                                        </div>}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </PageLayout>
        );
    } else {
        return (
            <PageLayout>
                <h2 className="text-xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
                    Empty queue
                </h2>
                <p className="mt-1 text-gray-700">Nothing pending in the queue at the moment.</p>
            </PageLayout>
        );
    }
}

export default QueueList;