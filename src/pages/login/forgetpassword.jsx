import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa";

const ForgotPassword = ({ onClose }) => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Email verified. Sending OTP...");
        await fetch("http://localhost:5000/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        setStep("otp");
      } else {
        toast.error(data.message || "Email not found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();
      if (data.success) {
        toast.success("OTP verified. Please enter new password.");
        setStep("password");
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword })
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Password updated successfully!");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(data.message || "Error updating password");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="bg-white p-4 rounded shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <h4 className="text-center mb-4">Reset Your Password</h4>

        {step === "email" && (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-3">
              <label className="form-label">Enter your email</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-0"><FaEnvelope /></span>
                <input
                  type="email"
                  className="form-control border-0 border-bottom"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <button className="btn btn-primary w-100">Send OTP</button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-3">
              <label className="form-label">Enter OTP sent to email</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-0"><FaKey /></span>
                <input
                  type="text"
                  className="form-control border-0 border-bottom"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  required
                />
              </div>
            </div>
            <button className="btn btn-primary w-100">Verify OTP</button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-3">
              <label className="form-label">Enter New Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white border-0"><FaLock /></span>
                <input
                  type="password"
                  className="form-control border-0 border-bottom"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </div>
            <button className="btn btn-success w-100">Update Password</button>
          </form>
        )}

        <div className="text-center mt-3">
             <button className="btn btn-link" onClick={() => navigate('/login')}>
  Back to Login
</button>
        </div>




        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default ForgotPassword;