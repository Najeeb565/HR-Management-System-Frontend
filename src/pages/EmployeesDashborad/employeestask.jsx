import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Employeestask = () => {
  const [tasks, setTasks] = useState([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUserEmail(user.email);
    }
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    fetchTasks();
  }, [userEmail]);

  const fetchTasks = () => {
    axios
      .get(`http://localhost:5000/api/tasks?email=${userEmail}`)
      .then((res) => setTasks(res.data))
      .catch((err) => console.error('Error fetching tasks:', err));
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        status: newStatus,
      });
      fetchTasks(); // Refresh the task list
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>My Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned to you.</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            style={{
              marginBottom: 15,
              padding: 15,
              border: '1px solid #ddd',
              borderRadius: 8,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              backgroundColor: '#fff',
            }}
          >
            {/* FLEX CONTAINER WITH CONTENT ON LEFT AND BUTTONS ON RIGHT */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p><strong>Title:</strong> {task.taskTitle}</p>
                <p><strong>Description:</strong> {task.description}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span style={{ color: task.status === 'done' ? 'green' : 'orange' }}>
                    {task.status}
                  </span>
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => updateStatus(task._id, 'done')}
                  disabled={task.status === 'done'}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: task.status === 'done' ? 'not-allowed' : 'pointer',
                    minWidth: 80
                  }}
                >
                  Done
                </button>
                <button
                  onClick={() => updateStatus(task._id, 'pending')}
                  disabled={task.status === 'pending'}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#ffc107',
                    color: 'black',
                    border: 'none',
                    borderRadius: 4,
                    cursor: task.status === 'pending' ? 'not-allowed' : 'pointer',
                    minWidth: 80
                  }}
                >
                  Pending
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Employeestask;