import { Transition } from "@headlessui/react";
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import { useContext, useEffect } from "react";
import { NotificationContext } from "../contexts/notification-context";

function Notification({ notification }) {
    const { removeNotification } = useContext(NotificationContext);
    console.log(notification);
    const { id, message, type } = notification;
    const [show, setShow] = useState(false);

    function displayType(type) {
        if (type === 'success') {
            return <CheckCircleIcon className="h6 w-6 text-green-400" aria-hidden="true" />
        } else if (type === 'error') {
            return <ExclamationCircleIcon className="h6 w-6 text-red-400" aria-hidden="true" />
        } else {
            return <InformationCircleIcon className="h6 w-6 text-gray-400" aria-hidden="true" />
        }
    }

    useEffect(() => {
        setShow(true);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            removeNotification(id);
        }, 5000);

        return () => clearTimeout(timeout);
    }, [id, removeNotification]);

    return (
        <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-x-0">
                <div className="max-w-sm w-full mb-4 bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0">
                                {displayType(type)}
                            </div>

                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                <p className="text-sm font-medium text-gray-900">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
        </Transition>
    )
}

export default Notification;