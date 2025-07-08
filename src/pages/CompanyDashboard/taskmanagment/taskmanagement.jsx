import React, { useState, useEffect } from 'react';
import axios from '../../../axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import styles from './TaskManagement.module.css';

const TaskManagement = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [employeeList, setEmployeeList] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const companyId = user?.companyId;
        if (!companyId) return;

        const res = await axios.get(`http://localhost:5000/api/tasks?companyId=${companyId}`);
        setTasks(res.data);
      } catch {
        toast.error("Failed to load tasks!");
      }
    };

    fetchTasks();
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
        toast.error("Could not load employees");
      }
    };
    fetchEmployees();
  }, []);

  const employeeOptions = employeeList.map(emp => ({
    value: emp._id,
    label: (
      <div className={styles.employeeOption}>
        <span>{emp.firstName} {emp.lastName}</span>
        <span className={styles.employeeEmail}>{emp.email}</span>
      </div>
    )
  }));

  const handleAddTask = () => {
    setShowForm(true);
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
      status: 'pending',
      companyId: JSON.parse(localStorage.getItem("user")).companyId
    };

    try {
      if (editMode) {
        const res = await axios.put(`http://localhost:5000/api/tasks/${editTaskId}`, taskData);
        setTasks(tasks.map(task => task._id === editTaskId ? res.data : task));
        toast.success("Task updated successfully!");
      } else {
        const res = await axios.post('http://localhost:5000/api/tasks/post', taskData);
        setTasks([...tasks, res.data]);
        toast.success("Task added successfully!");
      }
      setShowForm(false);
    } catch {
      toast.error(editMode ? "Failed to update task!" : "Failed to add task!");
    }
  };

  const handleEdit = (task) => {
    setSelectedEmployeeId(task.assignedTo);
    setTaskTitle(task.taskTitle);
    setDescription(task.description);
    setEditTaskId(task._id);
    setEditMode(true);
    setShowForm(true);
  };

  const getEmployeeName = (employeeId) => {
    const emp = employeeList.find(e => e._id === employeeId);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unassigned';
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      setTasks(tasks.filter(task => task._id !== id));
      toast.success("Task deleted!");
    } catch {
      toast.error("Failed to delete task!");
    }
  };

  const toggleDetails = (id) => {
    setExpandedTaskId(expandedTaskId === id ? null : id);
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/tasks/${taskId}/status`, { status: newStatus });
      setTasks(tasks.map(task => task._id === taskId ? res.data : task));
      toast.success("Status updated!");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch = task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getEmployeeName(task.assignedTo).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Leave Management</h1>

        <div className={styles.controls}>
          <button className={styles.primaryButton} onClick={handleAddTask}>
            <i className="material-icons me-1">add</i> New Request
          </button>

          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <i className="material-icons">view_list</i>
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <i className="material-icons">grid_view</i>
            </button>
          </div>
        </div>
      </div>


      <div className={styles.toolbar}>
        <div className={styles.search}>
          <i className={`material-icons ${styles.searchIcon}`}></i>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Completed</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formCard}>
            <div className={styles.formHeader}>
              <h2>{editMode ? 'Edit Task' : 'Create New Task'}</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowForm(false)}
              >
                <i className="material-icons btn-close"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Assign to</label>
                <Select
                  options={employeeOptions}
                  onChange={(selected) => setSelectedEmployeeId(selected.value)}
                  className={styles.select}
                  placeholder="Select employee..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Task Title</label>
                <input
                  className={styles.input}
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter task details..."
                  required
                ></textarea>
              </div>

              <div className={styles.formActions}>
                <button type="button" className={styles.secondaryButton} onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryButton}>
                  {editMode ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="material-icons">assignment</i>
          <p>No tasks found</p>
          <button className={styles.primaryButton} onClick={handleAddTask}>
            Create your first task
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <div className={styles.taskList}>
          {filteredTasks.map(task => (
            <div className={styles.taskCard} key={task._id}>
              <div className={styles.taskHeader} onClick={() => toggleDetails(task._id)}>
                <div className={styles.taskTitle}>
                  <span className={styles.taskIndicator}></span>
                  <h3>{task.taskTitle}</h3>
                  <span className={`${styles.status} ${styles[task.status.replace('-', '')]}`}>
                    {task.status.replace('-', ' ')}
                  </span>



                </div>
                {(() => {
                  const empName = getEmployeeName(task.assignedTo);
                  const initial = empName && empName !== 'Unassigned' ? empName.charAt(0) : '?';
                  return (
                    <div className={styles.assignedTo}>
                      <span className={styles.avatar}>{initial}</span>
                      <span>{empName}</span>
                    </div>
                  );
                })()}


                <i className={`material-icons ${styles.expandIcon}`}>
                  {expandedTaskId === task._id ? 'expand_less' : 'expand_more'}
                </i>
              </div>

              {expandedTaskId === task._id && (
                <div className={styles.taskDetails}>
                  <div className={styles.detailRow}>
                    <label>Description:</label>
                    <p>{task.description}</p>
                  </div>
                  <div className={styles.detailRow}>

                  </div>
                  <div className={styles.taskActions}>
                    <button
                      className={styles.editButton}
                      onClick={() => handleEdit(task)}
                    >
                      <i className="material-icons">edit</i>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(task._id)}
                    >
                      <i className="material-icons">delete</i>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.taskGrid}>
          {filteredTasks.map(task => (
            <div className={styles.gridCard} key={task._id}>
              <div className={styles.gridHeader}>
                <h3>{task.taskTitle}</h3>
                <span className={`${styles.status} ${styles[task.status]}`}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>
              <div className={styles.gridBody}>
                <p className={styles.gridDescription}>
                  {task.description.length > 100
                    ? `${task.description.substring(0, 100)}...`
                    : task.description}
                </p>
                {(() => {
                  const empName = getEmployeeName(task.assignedTo);
                  const initial = empName && empName !== 'Unassigned' ? empName.charAt(0) : '?';
                  return (
                    <div className={styles.assignedTo}>
                      <span className={styles.avatar}>{initial}</span>
                      <span>{empName}</span>
                    </div>
                  );
                })()}

              </div>
              <div className={styles.gridFooter}>
                <button
                  className={styles.iconButton}
                  onClick={() => handleEdit(task)}
                  title="Edit"
                >
                  <i className="material-icons">edit</i>
                </button>
                <button
                  className={styles.iconButton}
                  onClick={() => handleDelete(task._id)}
                  title="Delete"
                >
                  <i className="material-icons">delete</i>
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default TaskManagement;