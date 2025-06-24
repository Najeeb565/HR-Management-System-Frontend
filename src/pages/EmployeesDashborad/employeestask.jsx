import React, { useState } from 'react';
import axios from 'axios';

const AdminTaskForm = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/tasks', {
        taskTitle,
        description,
        email
      });

      alert("Task assigned successfully!");
      setTaskTitle('');
      setDescription('');
      setEmail('');
    } catch (err) {
      console.error("Error creating task:", err);
      alert("Failed to assign task.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 20 }}>
      <h3>Assign Task to Employee</h3>

      <input
        type="text"
        placeholder="Task Title"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        required
      />
      <br />

      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <br />

      <input
        type="email"
        placeholder="Employee Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <br />

      <button type="submit">Assign Task</button>
    </form>
  );
};

export default AdminTaskForm;
