import React, { useState } from "react";
import Notification from "../components/notification";
import { generateId } from "../util/random";

export const NotificationContext = React.createContext({
    notificationList: [],
    addNotification: () => {},
    removeNotification: () => {}
});

export default function NotificationProvider({ children }) {
    const [notificationList, setNotificationList] = useState([]);

    const contextValue = {
        notificationList,
        addNotification: (type, message) => {
            const id = generateId(6);
            setNotificationList((prev) => [...prev, { id, message, type }]);
        },
        removeNotification: (id) => {
            if (id && notificationList.length > 0) {
                setNotificationList((prev) => prev.filter((notification) => notification.id !== id));
            }
        }
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            <div aria-live="assertive"
                className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none z-50">
                {notificationList.map((notification) => (
                    <Notification key={notification.id} notification={notification} />
                ))}
            </div>

            {children}
        </NotificationContext.Provider>
    )
}