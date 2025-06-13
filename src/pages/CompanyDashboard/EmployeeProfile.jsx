import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
      setEmployee(response.data);
    } catch (error) {
      console.error('Error fetching employee:', error);
      alert('Error loading employee data');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    const classes = {
      'Admin': 'bg-danger',
      'Manager': 'bg-warning text-dark',
      'HR': 'bg-info',
      'Employee': 'bg-secondary'
    };
    return classes[role] || 'bg-secondary';
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      'Active': 'bg-success',
      'Inactive': 'bg-warning text-dark',
      'Terminated': 'bg-danger'
    };
    return classes[status] || 'bg-secondary';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatSalary = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-person-x fs-1 text-muted"></i>
        <h4 className="text-muted mt-3">Employee not found</h4>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate('/employees')}
        >
          Back to Employee List
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Employee Profile</h1>
        <div className="d-flex gap-2">
          <Link
            to={`/employees/edit/${employee._id}`}
            className="btn btn-warning btn-custom"
          >
            <i className="bi bi-pencil me-2"></i>
            Edit Profile
          </Link>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate('/employees')}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to List
          </button>
        </div>
      </div>

      <div className="row">
        {/* Profile Header */}
        <div className="col-lg-4">
          <div className="card dashboard-card mb-4">
            <div className="card-body text-center">
              <div className="mb-3">
                <img
                  src={employee.profilePicture 
                    ? `http://localhost:5000/uploads/${employee.profilePicture}`
                    : 'https://via.placeholder.com/150x150?text=No+Image'
                  }
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="profile-avatar"
                />
              </div>
              <h4 className="fw-bold">{employee.firstName} {employee.lastName}</h4>
              <p className="text-muted mb-3">{employee.email}</p>
              
              <div className="d-flex justify-content-center gap-2 mb-3">
                <span className={`badge role-badge ${getRoleBadgeClass(employee.role)}`}>
                  {employee.role}
                </span>
                <span className={`badge ${getStatusBadgeClass(employee.status)}`}>
                  {employee.status}
                </span>
              </div>

              <div className="border-top pt-3">
                <div className="row text-center">
                  <div className="col-6">
                    <div className="fw-bold text-primary">{employee.employeeId}</div>
                    <small className="text-muted">Employee ID</small>
                  </div>
                  <div className="col-6">
                    <div className="fw-bold text-success">{formatSalary(employee.salary)}</div>
                    <small className="text-muted">Salary</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="col-lg-8">
          <div className="card dashboard-card mb-4">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-person-lines-fill me-2"></i>
                Personal Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted">First Name</label>
                  <div className="fw-semibold">{employee.firstName}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted">Last Name</label>
                  <div className="fw-semibold">{employee.lastName}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted">Email</label>
                  <div className="fw-semibold">
                    <a href={`mailto:${employee.email}`} className="text-decoration-none">
                      {employee.email}
                    </a>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted">Phone</label>
                  <div className="fw-semibold">
                    <a href={`tel:${employee.phone}`} className="text-decoration-none">
                      {employee.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card dashboard-card mb-4">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-briefcase me-2"></i>
                Job Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted">Role</label>
                  <div className="fw-semibold">{employee.role}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted">Department</label>
                  <div className="fw-semibold">{employee.department}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted">Status</label>
                  <div className="fw-semibold">{employee.status}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted">Joining Date</label>
                  <div className="fw-semibold">{formatDate(employee.joiningDate)}</div>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label text-muted">Salary</label>
                  <div className="fw-semibold text-success">{formatSalary(employee.salary)}</div>
                </div>
              </div>
            </div>
          </div>

          {employee.address && (
            <div className="card dashboard-card">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">
                  <i className="bi bi-geo-alt me-2"></i>
                  Address Information
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="form-label text-muted">Street Address</label>
                    <div className="fw-semibold">{employee.address.street || 'Not provided'}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">City</label>
                    <div className="fw-semibold">{employee.address.city || 'Not provided'}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">State</label>
                    <div className="fw-semibold">{employee.address.state || 'Not provided'}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Zip Code</label>
                    <div className="fw-semibold">{employee.address.zipCode || 'Not provided'}</div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label text-muted">Country</label>
                    <div className="fw-semibold">{employee.address.country || 'Not provided'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;