import React, { useState, useEffect } from 'react';
import axios from '../../../axios';
import styles from './EmployeeTask.module.css';

const EmployeeTask = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'in-progress', 'done'

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  useEffect(() => {
    if (user?._id && user?.companyId) {
      fetchTasks(user._id);
    }
  }, [user]);

  const fetchTasks = (userId) => {
    setLoading(true);
    const companyId = user?.companyId;
    axios
      .get(`http://localhost:5000/api/tasks?assignedTo=${userId}&companyId=${companyId}`)
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
        setLoading(false);
      });
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        status: newStatus,
      });
      fetchTasks(user._id);
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    return task.status === activeTab;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'done':
        return styles.statusDone;
      case 'in-progress':
        return styles.statusInProgress;
      default:
        return styles.statusPending;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Tasks</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Tasks
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'pending' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'in-progress' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('in-progress')}
          >
            In Progress
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'done' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('done')}
          >
            Completed
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your tasks...</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3>No tasks found</h3>
          <p>{activeTab === 'all' ? "You don't have any tasks assigned yet." : `You don't have any ${activeTab} tasks.`}</p>
        </div>
      ) : (
        <div className={styles.taskList}>
          {filteredTasks.map((task) => (
            <div className={styles.taskCard} key={task._id}>
              <div className={styles.taskContent}>
                <div className={styles.taskHeader}>
                  <h3 className={styles.taskTitle}>{task.taskTitle}</h3>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
                <p className={styles.taskDescription}>{task.description}</p>
                <div className={styles.taskMeta}>
                  <span className={styles.taskDate}>
                    Assigned on: {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className={styles.taskActions}>
                {task.status !== 'pending' && (
                  <button
                    className={styles.actionButtonPending}
                    onClick={() => updateStatus(task._id, 'pending')}
                  >
                    Mark as Pending
                  </button>
                )}
                {task.status !== 'in-progress' && (
                  <button
                    className={styles.actionButtonInProgress}
                    onClick={() => updateStatus(task._id, 'in-progress')}
                  >
                    Start Progress
                  </button>
                )}
                {task.status !== 'done' && (
                  <button
                    className={styles.actionButtonDone}
                    onClick={() => updateStatus(task._id, 'done')}
                  >
                    Complete Task
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployeeTask;