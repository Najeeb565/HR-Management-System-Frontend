import React, { useState } from 'react';
import './superadmin.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SuperAdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();

    // Dummy credentials
    const correctEmail = "admin@super.com";
    const correctPassword = "admin123";

    if (email === correctEmail && password === correctPassword) {
      toast.success("✅ Superadmin Login Successful!");
      setEmail('');
      setPassword('');
    } else {
      toast.error("❌ Invalid email or password.");
    }
  };

  return (
    <div className="superadmin-container">
      <div className="superadmin-card">
        <h1 className="superadmin-title">Superadmin Login</h1>
        <form className="superadmin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-row">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="loginbtn">Login</button>
        </form>
      </div>
      {/* Toast container */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default SuperAdminLogin;
