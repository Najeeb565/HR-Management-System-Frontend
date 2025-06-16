import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const roles = ['Employee', 'Manager', 'Admin', 'HR'];
  const statuses = ['Active', 'Inactive', 'Terminated'];

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, selectedRole, selectedStatus]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole) {
      filtered = filtered.filter(emp => emp.role === selectedRole);
    }

    if (selectedStatus) {
      filtered = filtered.filter(emp => emp.status === selectedStatus);
    }

    setFilteredEmployees(filtered);
  };

  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/employees/${employeeToDelete._id}`);
      setEmployees(employees.filter(emp => emp._id !== employeeToDelete._id));
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Error deleting employee');
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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Employee Management</h1>
        <Link to="/company-dashboard/employees/add" className="btn btn-primary btn-custom">
          <i className="bi bi-person-plus me-2"></i>
          Add New Employee
        </Link>
      </div>

      {/* Filters */}
      <div className="card dashboard-card mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control search-box"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('');
                  setSelectedStatus('');
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="card dashboard-card">
        <div className="card-body">
          {filteredEmployees.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-custom">
                <thead>
                  <tr>
                    <th>Photo</th>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee._id}>
                      <td>
                        <img
                          src={employee.profilePicture 
                            ? `http://localhost:5000/uploads/${employee.profilePicture}`
                            : 'https://via.placeholder.com/50x50?text=No+Image'
                          }
                          alt={`${employee.firstName} ${employee.lastName}`}
                          className="employee-avatar"
                        />
                      </td>
                      <td className="fw-semibold">{employee.employeeId}</td>
                      <td>{employee.firstName} {employee.lastName}</td>
                      <td>{employee.email}</td>
                      <td>
                        <span className={`badge role-badge ${getRoleBadgeClass(employee.role)}`}>
                          {employee.role}
                        </span>
                      </td>
                      <td>{employee.department}</td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link
                            to={`/employees/profile/${employee._id}`}
                            className="btn btn-sm btn-outline-info"
                            title="View Profile"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          <Link
                            to={`/employees/edit/${employee._id}`}
                            className="btn btn-sm btn-outline-warning"
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteClick(employee)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-people fs-1 text-muted"></i>
              <h4 className="text-muted mt-3">No employees found</h4>
              <p className="text-muted">Try adjusting your search criteria or add a new employee.</p>
              <Link to="/company-dashboard/employees/add" className="btn btn-primary">
                Add First Employee
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-custom">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this employee?</p>
                <div className="alert alert-warning">
                  <strong>{employeeToDelete?.firstName} {employeeToDelete?.lastName}</strong>
                  <br />
                  <small>Employee ID: {employeeToDelete?.employeeId}</small>
                </div>
                <p className="text-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteConfirm}
                >
                  Delete Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;