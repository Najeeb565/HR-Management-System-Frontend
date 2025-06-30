import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Employeestask = () => {
  const [tasks, setTasks] = useState([]);
  const [userEmail, setUserEmail] = useState('');
  const [user, setUser] = useState(null);

  // Step 1: Get logged-in user's email from localStorage
useEffect(() => {
  const userData = localStorage.getItem("user");
  if (userData) {
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser); // ✅ set the user object
    setUserEmail(parsedUser.email); // optional: still use email
  }
}, []);


  // Step 2: Fetch tasks when userEmail is available
useEffect(() => {
  if (user?._id) {
    fetchTasks(user._id);
  }
}, [user]);

  // Step 3: API call to backend to get tasks for specific email
  const fetchTasks = (userId) => {
  axios
    .get(`http://localhost:5000/api/tasks?assignedTo=${userId}`)
    .then((res) => setTasks(res.data))
    .catch((err) => console.error('Error fetching tasks:', err));
};


  // Step 4: Update task status (done / pending)
  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        status: newStatus,
      });
     fetchTasks(user._id); // refresh task list after update
    } catch (err) {
      console.error('Error updating task status:', err);
    }
  };

 return (
  <div className="container py-4">
    <h2 className="text-primary mb-4">📋 My Tasks</h2>

    {tasks.length === 0 ? (
      <div className="alert alert-info">No tasks assigned to you.</div>
    ) : (
      <div className="row">
        {tasks.map((task) => (
          <div className="col-md-12 mb-4" key={task._id}>
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="card-title text-secondary">{task.taskTitle}</h5>
                  <p className="card-text mb-1"><strong>Description:</strong> {task.description}</p>
                  <p className="card-text mb-2">
                    <strong>Status:</strong>{' '}
                    <span className={`badge ${task.status === 'done' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {task.status}
                    </span>
                  </p>
                </div>

                <div className="d-flex flex-column align-items-end gap-2">
                  <button
                    onClick={() => updateStatus(task._id, 'done')}
                    disabled={task.status === 'done'}
                    className="btn btn-sm btn-success"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => updateStatus(task._id, 'pending')}
                    disabled={task.status === 'pending'}
                    className="btn btn-sm btn-warning"
                  >
                    Pending
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

};

export default Employeestask;
