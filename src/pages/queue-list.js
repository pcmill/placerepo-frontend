import { useContext, useEffect } from "react";
import PageLayout from "../components/page-layout";
import { QueueContext } from "../contexts/queue-context";
import { AuthContext } from "../contexts/auth-context";
import AddPlaceQueue from "../components/queue/add-place";
import * as timeago from 'timeago.js';
import UpdatePlaceQueue from "../components/queue/update-place";
import AddTranslationQueue from "../components/queue/translation";
import EditTranslationQueue from "../components/queue/translation-edit";
import { NotificationContext } from "../contexts/notification-context";

function QueueList() {
    const { queue, setQueue } = useContext(QueueContext);
    const { accessToken, user } = useContext(AuthContext);
    const { addNotification } = useContext(NotificationContext);

    useEffect(() => {
        const fetchQueue = async () => {
            const data = await fetch(`${process.env.REACT_APP_BACKEND}/v1/queue`);

            const q = await data.json();
            setQueue(q);
        }

        fetchQueue();
    }, [setQueue]);

    const handleStatus = async (id, status) => {
        const res = await fetch(`${process.env.REACT_APP_BACKEND}/v1/queue/status/${id}`, {
            method: 'POST',
            body: JSON.stringify({
                status: Number(status),
            }),
            headers: {
                'content-type': 'application/json',
                'x-access-token': accessToken                    
            }
        });

        if (res.ok) {
            addNotification('success', 'Queue item updated', 5000);

            // Remove from queue
            setQueue((prev) => prev.filter((q) => q.id !== id));
        } else {
            addNotification('error', 'Could not update queue item');
        }
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

                                        {q.request_type === 'add_place' && <AddPlaceQueue queueItem={q} />}
                                        {q.request_type === 'update_place' && <UpdatePlaceQueue queueItem={q} />}
                                        {q.request_type.startsWith('add') && q.request_type.endsWith('_translation') && <AddTranslationQueue queueItem={q} />}
                                        {q.request_type.startsWith('update') && q.request_type.endsWith('_translation') && <EditTranslationQueue queueItem={q} />}

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