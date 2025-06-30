// Same imports as before
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';


const Taskmanagement = () => {
  const [showCard, setShowCard] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [email, setEmail] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then(res => setTasks(res.data))
      .catch(() => toast.error("❌ Failed to load tasks!"));
  }, []);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const companyId = user?.companyId;
        if (!companyId) return;
        const res = await axios.get(`http://localhost:5000/api/employees?companyId=${companyId}`);
        setEmployeeList(res.data);
      } catch {
        toast.error("❌ Could not load employees");
      }
    };
    fetchEmployees();
  }, []);

  const employeeOptions = employeeList.map(emp => ({
    value: emp._id,
    label: (
      <div className="d-flex justify-content-between">
        <span>{emp.firstName} {emp.lastName}</span>
        <span className="text-muted" style={{ fontSize: '0.85rem' }}>{emp.email}</span>
      </div>
    )
  }));

  const handleAddTask = () => {
    setShowCard(true);
    setEditMode(false);
    setSelectedEmployeeId('');
    setTaskTitle('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = {
      assignedTo: selectedEmployeeId,
      taskTitle,
      description,
      status: 'pending'
    };

    try {
      if (editMode) {
        const res = await axios.put(`http://localhost:5000/api/tasks/${editTaskId}`, taskData);
        setTasks(tasks.map(task => task._id === editTaskId ? res.data : task));
        toast.success("✏️ Task Updated Successfully!");
      } else {
        const res = await axios.post('http://localhost:5000/api/tasks/post', taskData);
        setTasks([...tasks, res.data]);
        toast.success("✅ Task Added Successfully!");
      }
      setShowCard(false);
    } catch {
      toast.error(editMode ? "❌ Failed to update task!" : "❌ Failed to add task!");
    }
  };

  const handleEdit = (task) => {
    setSelectedEmployeeId(task.assignedTo);
    setTaskTitle(task.taskTitle);
    setDescription(task.description);
    setEditTaskId(task._id);
    setEditMode(true);
    setShowCard(true);
  };
  const getEmployeeFirstName = (employeeId) => {
    const emp = employeeList.find(e => e._id === employeeId);
    return emp ? emp.firstName : 'Unknown';
  };


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success("🗑️ Task Deleted!");
    } catch {
      toast.error("❌ Failed to delete task!");
    }
  };

  const toggleDetails = (id) => {
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">🛠️ Task Management</h2>
        <button className="btn btn-primary" onClick={handleAddTask}>Add Task</button>
      </div>

      {showCard && (
        <div className="card mb-4 shadow-sm position-relative">
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-3"
            aria-label="Close"
            onClick={() => setShowCard(false)}
          ></button>
          <div className="card-body">
            <h5 className="card-title">{editMode ? 'Edit Task' : 'Add New Task'}</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Assign to:</label>
                <Select
                  options={employeeOptions}
                  onChange={(selected) => setSelectedEmployeeId(selected.value)}
                  className="mb-3"
                  placeholder="Select Employee"
                  required
                />


              </div>

              <div className="mb-3">
                <label className="form-label">Task Title:</label>
                <input
                  className="form-control"
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description:</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-success">
                {editMode ? 'Update Task' : 'Add Task'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {tasks.length === 0 ? (
          <p>No tasks added yet.</p>
        ) : (
          tasks.map(task => (
            <div className="col-md-12 mb-4" key={task._id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h4
                    className="card-title text-secondary"
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleDetails(task._id)}
                  >
                    🧾 Task for <strong>{getEmployeeFirstName(task.assignedTo)}</strong>
                  </h4>

                  {expandedTaskId === task._id && (
                    <div className="mt-3">
                      <p><strong>Title:</strong> {task.taskTitle}</p>
                      <p><strong>Description:</strong> {task.description}</p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className={`badge ${task.status === 'done' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {task.status.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleEdit(task)}>Edit</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(task._id)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Taskmanagement;
