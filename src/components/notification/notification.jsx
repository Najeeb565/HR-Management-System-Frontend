
// notification.jsx
import React, { useEffect, useState } from "react";
import axios from "../../axios";
import styles from "./notification.module.css";
import { Bell } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";
import { useSocket } from "../../context/SocketContext";

const NotificationDropdown = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const { refreshNotifications } = useNotification();
  const socket = useSocket();
 

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(`/notifications/${userId}`);

        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error fetching notifications:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        setNotifications([]);
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId, refreshNotifications]);

  useEffect(() => {
    if (!socket || !userId) {
      console.log("Socket or userId missing:", { socket, userId });
      return;
    }

    socket.emit("join", userId);
    const handleNewNotification = (newNotification) => {
      if (newNotification.recipientId === userId) {

        setNotifications((prev) => [newNotification, ...prev]);
      } else {
        console.log("Notification ignored, recipientId mismatch:", {
          received: newNotification.recipientId,
          expected: userId,
        });
      }
    };

    socket.on("new_notification", handleNewNotification);

    socket.on("connect", () => {
      socket.emit("join", userId);
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    return () => {
      socket.off("new_notification", handleNewNotification);
      socket.off("connect");
      socket.off("error");
    };
  }, [socket, userId]);

  const handleClearNotifications = async () => {
    try {
      const response = await axios.delete(`/notifications/${userId}`);
      console.log("Notifications cleared for user:", userId, response.data);
      setNotifications([]);
    } catch (error) {
      console.error("❌ Error clearing notifications:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.iconWrapper} onClick={() => setOpen(!open)}>
        <Bell size={28} />
        {notifications.length > 0 && (
          <span className={styles.badge}>{notifications.length}</span>
        )}
      </div>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            <h4>Notifications</h4>
            {notifications.length > 0 && (
              <button
                className={styles.clearButton}
                onClick={handleClearNotifications}
              >
                Clear All
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className={styles.empty}>No new notifications</p>
          ) : (
            <ul className={styles.list}>
              {notifications.map((n) => (
                <li key={n._id} className={styles.item}>
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                  <span className={styles.time}>
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;