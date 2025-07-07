import React, { useContext } from "react";
import { EmployeeContext } from "../../../context/EmployeeContext";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiLogOut, FiMail, FiPhone, FiBriefcase, FiX, FiUser } from "react-icons/fi";

const EmployeeCard = ({ onClose }) => {
  const { employee, loading } = useContext(EmployeeContext);
  const navigate = useNavigate();

  if (loading || !employee) {
    return (
      <div className="card shadow border-0" style={{ width: "380px" }}>
        <div className="card-body text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 mb-0 text-muted">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="card shadow-lg border-0 overflow-hidden"
      style={{
        width: "380px",
        borderRadius: "16px",
      }}
    >
      {/* Profile Header with Cover */}
      <div className="position-relative">
        <div 
          className="bg-primary bg-opacity-10" 
          style={{ height: "70px" }}
        >
            <div className="d-flex justify-content-end">
          <button
            className="btn btn-sm btn-light rounded-circle m-3"
            onClick={onClose}
            title="Close"
          >
            <FiX size={14} />
          </button>
        </div>
        </div>
        
        <div className="position-absolute top-100 start-50 translate-middle">
          <div className="position-relative">
            <img
              src={employee?.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className="rounded-circle border border-4 border-white shadow"
              style={{ 
                width: "100px", 
                height: "100px", 
                objectFit: "cover" 
              }}
            />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body pt-4 pb-3 px-4  ">
      

        <div className="text-center mb-4 mt-4">
          <h4 className="mb-1 fw-bold">{employee?.name}</h4>
          <p className="text-primary mb-2 fw-medium">{employee?.position || "Employee"}</p>
          {employee?.department && (
            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
              {employee.department}
            </span>
          )}
        </div>

        <div className="list-group list-group-flush">
          <div className="list-group-item border-0 px-0 py-2 d-flex align-items-center">
            <FiMail className="flex-shrink-0 me-3 text-primary" size={18} />
            <div>
              <small className="text-muted">Email</small>
              <p className="mb-0 text-break">{employee?.email}</p>
            </div>
          </div>

          <div className="list-group-item border-0 px-0 py-2 d-flex align-items-center">
            <FiPhone className="flex-shrink-0 me-3 text-primary" size={18} />
            <div>
              <small className="text-muted">Phone</small>
              <p className="mb-0">{employee?.phone || "Not provided"}</p>
            </div>
          </div>

          {employee?.employeeId && (
            <div className="list-group-item border-0 px-0 py-2 d-flex align-items-center">
              <FiBriefcase className="flex-shrink-0 me-3 text-primary" size={18} />
              <div>
                <small className="text-muted">Employee ID</small>
                <p className="mb-0">{employee.employeeId}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer bg-transparent border-top d-flex justify-content-between px-4 py-3">
        <button
          className="btn btn-primary d-flex align-items-center px-4"
          onClick={() => navigate("profile")}
        >
          <FiEdit className="me-2" />
          Edit Profile
        </button>
        <button
          className="btn btn-outline-secondary d-flex align-items-center px-4"
          onClick={() => navigate("/logout")}
        >
          <FiLogOut className="me-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;