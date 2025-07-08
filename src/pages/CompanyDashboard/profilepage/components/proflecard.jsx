// src/components/AdminCard.jsx
import React, { useContext } from "react";
import { CompanyContext } from "../../../../context/CompanyContext";
import { useNavigate } from "react-router-dom";
import { FiEdit, FiLogOut, FiMail, FiPhone, FiBriefcase, FiX } from "react-icons/fi";

const AdminCard = ({ onClose }) => {
  const { company } = useContext(CompanyContext);
  const navigate = useNavigate();

  if (!company) {
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
      {/* Header */}
      <div className="position-relative">
        <div className="bg-primary bg-opacity-10" style={{ height: "70px" }}>
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
          <img
            src={company?.profilePicture || "/default-avatar.png"}
            alt="Admin Profile"
            className="rounded-circle border border-4 border-white shadow"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="card-body pt-4 pb-3 px-4 mt-4">
        <div className="text-center mb-4">
          <h4 className="fw-bold mb-1">{company?.name}</h4>
          <p className="text-primary mb-2 fw-medium">Company Admin</p>
          {company?.companyName && (
            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
              {company.companyName}
            </span>
          )}
        </div>

        <div className="list-group list-group-flush">
          <div className="list-group-item border-0 px-0 py-2 d-flex align-items-center">
            <FiMail className="me-3 text-primary" size={18} />
            <div>
              <small className="text-muted">Email</small>
              <p className="mb-0">{company?.email}</p>
            </div>
          </div>

          <div className="list-group-item border-0 px-0 py-2 d-flex align-items-center">
            <FiPhone className="me-3 text-primary" size={18} />
            <div>
              <small className="text-muted">Phone</small>
              <p className="mb-0">{company?.phoneNumber || "Not provided"}</p>
            </div>
          </div>

          {company?.companyId && (
            <div className="list-group-item border-0 px-0 py-2 d-flex align-items-center">
              <FiBriefcase className="me-3 text-primary" size={18} />
              <div>
                <small className="text-muted">Company ID</small>
                <p className="mb-0">{company.companyId}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="card-footer bg-transparent border-top d-flex justify-content-between px-4 py-3">
        <button
          className="btn btn-primary d-flex align-items-center px-4"
          onClick={() => navigate("AdminProfile")}
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

export default AdminCard;
