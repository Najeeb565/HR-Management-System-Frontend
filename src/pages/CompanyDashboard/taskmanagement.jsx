import React, { useState, useEffect } from 'react';
import './taskmangement.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Taskmanagement = () => {
  const [showCard, setShowCard] = useState(false);
  const [email, setEmail] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => {
        console.error(err);
        toast.error("❌ Failed to load tasks!");
      });
  }, []);

  const handleAddTask = () => {
    setShowCard(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = {
      email,
      taskTitle,
      description,
      status: 'pending'
    };

    try {
      const res = await axios.post('http://localhost:5000/api/tasks', newTask);
      setTasks([...tasks, res.data]);

      setEmail('');
      setTaskTitle('');
      setDescription('');
      setShowCard(false);

      toast.success("✅ Task Added Successfully!");
    } catch (err) {
      console.error('Task POST error:', err.message);
      toast.error("❌ Failed to add task!");
    }
  };

  const toggleDetails = (id) => {
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success("🗑️ Task Deleted!");
    } catch (error) {
      console.error('❌ Error deleting task:', error.message);
      toast.error("❌ Failed to delete task!");
    }
  };

  return (
    <div>
      <div className='header'>
        <h1>Task Management</h1>
        <button className='add-task-button' onClick={handleAddTask}>Add Task</button>
      </div>

      {showCard && (
        <div className="task-container" >
          <div className="task-card">
            <h2>Add New Task</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Employee Email:</label><br />
                <input
                  type="email"
                  placeholder="Enter employee email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Task Title:</label><br />
                <input
                  type="text"
                  placeholder="Enter task title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label><br />
                <textarea
                  placeholder="Enter task description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="button-group">
                <button type="submit" className="submit-button">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="task-list" style={{ width: '100%' }}>
        {tasks.length === 0 ? (
          <p>No tasks added yet.</p>
        ) : (
          tasks.map((task) => (
            <div>
              <div style={{display:'flex',justifyContent:'space-between', marginBottom: '10px'}}>
            <div key={task._id} className={`task-item ${task.status === 'pending' ? 'pending' : ''}`}>
              <h5
                onClick={() => toggleDetails(task._id)}
                style={{ cursor: 'pointer', color: 'gray' }}
              >
                <strong>tasked</strong> assigned to <strong>{task.email}</strong>
              </h5>
              </div>
              <div>
              <button className='delete-button'
                onClick={() => handleDelete(task._id)}
            
              >
                Delete
              </button>
              </div>
              </div>
              {expandedTaskId === task._id && (
                <>
                  <p><strong>Employee Email:</strong> {task.email}</p>
                  <p><strong>Task Title:</strong> {task.taskTitle}</p>
                  <p><strong>Description:</strong> {task.description}</p>
                  <p><strong>Status:</strong> {task.status}</p>
                  <hr />
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Toast container for all toasts */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default Taskmanagement;
