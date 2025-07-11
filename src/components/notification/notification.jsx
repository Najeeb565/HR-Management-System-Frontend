import React, { useEffect, useState } from "react";
import axios from "../../axios"; // ✅ use correct axios config
import styles from "./notification.module.css";
import { Bell } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

const NotificationDropdown = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const { refreshNotifications } = useNotification();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get(`/notifications/${userId}`);
        console.log("Fetched notifications =>", data);
        setNotifications(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        setNotifications([]); // prevent .map crash
      }
    };

    if (userId) {
      fetchNotifications();
    }
  }, [userId, refreshNotifications]);

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
          <h4>Notifications</h4>
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
