import { createContext, useContext, useState } from "react";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [refreshNotifications, setRefreshNotifications] = useState(0);

  const triggerNotificationUpdate = () => {
    setRefreshNotifications(prev => prev + 1);
  };

  return (
    <NotificationContext.Provider value={{ refreshNotifications, triggerNotificationUpdate }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
