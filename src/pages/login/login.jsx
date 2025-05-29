
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
// import "bootstrap/dist/css/bootstrap.min.css";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 Added Eye Icon
import { useNavigate } from 'react-router-dom';
import dashboard from "../landing/dashboard/dashboard";


const LoginPage = () => {
  // const [showPassword, setShowPassword] = useState(false); // 👈 Show/hide password state
const navigate = useNavigate(); 
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // 👈 Add this

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      role: Yup.string().required("Please select a role"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();

        if (data.success) {
          alert(`Login as ${values.role} successful!`);
          resetForm();
          setShowForgotPassword(false);
            navigate("/dashboard");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong!");
      }
    },
  });



  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center">
      <div
        className="bg-white p-5 rounded shadow"
        style={{
          width: "100%",
          maxWidth: "400px",
          marginLeft: "470px",
          fontSize: "14px",
        }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-0">
                <FaEnvelope />
              </span>
              <input
                type="email"
                name="email"
                className={`form-control border-0 border-bottom ${formik.touched.email && formik.errors.email
                    ? "is-invalid"
                    : ""
                  }`}
                placeholder="Type your email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            {formik.touched.email && formik.errors.email && (
              <div className="text-danger small">{formik.errors.email}</div>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-1">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-white border-0">
                <FaLock />
              </span>
              <input
                type={showPassword ? "text" : "password"} // 👈 Show/hide toggle
                name="password"
                className={`form-control border-0 border-bottom ${formik.touched.password && formik.errors.password
                    ? "is-invalid"
                    : ""
                  }`}
                placeholder="Type your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {/* 👇 Eye Icon */}
              <span
                className="input-group-text bg-white border-0"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {formik.touched.password && formik.errors.password && (
              <div className="text-danger small">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Forgot Password Link
          <div className="text-end mb-3">
            <a href="#" className="small text-decoration-none">
              Forgot Password?
            </a>
          </div> */}


          {showForgotPassword && (
            <div className="text-end mb-3">
              <a href="#" className="small text-decoration-none text-danger">
                Forgot Password?
              </a>
            </div>
          )}

          {/* Radio Buttons */}
          <div className="mb-3">
            <label className="form-label">Select Role</label>
            <div className="form-check">
              <input
                type="radio"
                name="role"
                id="admin"
                value="admin"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-check-input"
                checked={formik.values.role === "admin"}
              />
              <label
                htmlFor="admin"
                className="form-check-label"
                style={{ fontSize: "14px" }}
              >
                Admin
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                name="role"
                id="employee"
                value="employee"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-check-input"
                checked={formik.values.role === "employee"}
              />
              <label
                htmlFor="employee"
                className="form-check-label"
                style={{ fontSize: "14px" }}
              >
                Employee
              </label>
            </div>
            {formik.touched.role && formik.errors.role && (
              <div className="text-danger small">{formik.errors.role}</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{
              background: "linear-gradient(to right, #00c6ff, #0072ff)",
              border: "none",
            }}
          >
            LOGIN
          </button>
          <button>NEw Button</button>    
           </form>
      </div>
    </div>
  );
};

export default LoginPage;

