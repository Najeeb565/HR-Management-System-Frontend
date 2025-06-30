
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EmployeeList = () => {
  console.log("EmployeeList component loaded");
  const navigate = useNavigate();
  const { companySlug } = useParams();

  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));
    const companyId = user?.companyId;

    if (!companyId) {
      console.error("Company ID not found in localStorage");
      return;
    }

    // ✅ Send companyId in query params
    const response = await axios.get(`http://localhost:5000/api/employees?companyId=${companyId}`);

    if (Array.isArray(response.data)) {
      setEmployees(response.data);
      setFilteredEmployees(response.data);
    } else {
      console.error('Unexpected response format:', response.data);
      setEmployees([]);
      setFilteredEmployees([]);
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
    setEmployees([]);
    setFilteredEmployees([]);
  } finally {
    setLoading(false);
  }
};


const filterEmployees = () => {
  const term = searchTerm.toLowerCase().trim();

  const filtered = employees.filter(emp => {
    const firstName = emp.firstName?.toLowerCase() || '';
    const lastName = emp.lastName?.toLowerCase() || '';
    const roleMatch = selectedRole ? emp.role === selectedRole : true;
    const statusMatch = selectedStatus ? emp.status === selectedStatus : true;
    const searchMatch = term === '' || firstName.startsWith(term) || lastName.startsWith(term);

    return roleMatch && statusMatch && searchMatch;
  });

  setFilteredEmployees(filtered);
};

const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const handleViewClick = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  // const handleDeleteConfirm = async () => {
  //   try {
  //     await axios.delete(`http://localhost:5000/api/employees/${employeeToDelete._id}`);
  //     setEmployees(employees.filter(emp => emp._id !== employeeToDelete._id));
  //     setShowDeleteModal(false);
  //     setEmployeeToDelete(null);
  //   } catch (error) {
  //     console.error('Error deleting employee:', error);
  //     alert('Error deleting employee');
  //   }
  // };



  const handleDeleteConfirm = async () => {
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  try {
    await axios.delete(`http://localhost:5000/api/employees/${employeeToDelete._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
        <Link to={`/${companySlug}/company-dashboard/employees/add`} className="btn btn-primary btn-custom">
          <i className="bi bi-person-plus me-2"></i>
          Add New Employee
        </Link>

      </div>

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
              <select className="form-select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                <option value="">All Roles</option>
                {roles.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="">All Status</option>
                {statuses.map(status => <option key={status} value={status}>{status}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <button className="btn btn-outline-secondary w-100" onClick={() => {
                setSearchTerm('');
                setSelectedRole('');
                setSelectedStatus('');
              }}>Clear</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card dashboard-card">
        <div className="card-body">
          {filteredEmployees.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover table-custom">
                <thead>
                  <tr>
                    <th>Photo</th>
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
                      <td><img src={employee.profilePicture ? `http://localhost:5000/uploads/${employee.profilePicture}` : 'https://dummyimage.com/50x50/cccccc/000000&text=No+Image'} alt={`${employee.firstName} ${employee.lastName}`} className="employee-avatar" /></td>
                      <td>{employee.firstName} {employee.lastName}</td>
                      <td>{employee.email}</td>
                      <td><span className={`badge role-badge ${getRoleBadgeClass(employee.role)}`}>{employee.role}</span></td>
                      <td>{employee.department}</td>
                      <td><span className={`badge ${getStatusBadgeClass(employee.status)}`}>{employee.status}</span></td>
                      <td>
                        <div className="btn-group" role="group">
                          <button className="btn btn-sm btn-outline-info" onClick={() => handleViewClick(employee)} title="View Profile"><i className="bi bi-eye"></i></button>
                          <Link
                            to={`/${companySlug}/company-dashboard/employees/edit/${employee._id}`}
                            className="btn btn-sm btn-outline-warning"
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteClick(employee)} title="Delete"><i className="bi bi-trash"></i></button>
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
              <Link to="/company-dashboard/employees/add" className="btn btn-primary">Add First Employee</Link>
            </div>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-custom">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this employee?</p>
                <div className="alert alert-warning">
                  <strong>{employeeToDelete?.firstName} {employeeToDelete?.lastName}</strong>
                  <br />
                </div>
                <p className="text-danger"><i className="bi bi-exclamation-triangle me-2"></i>This action cannot be undone.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirm}>Delete Employee</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewModal && selectedEmployee && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modal-custom">
              <div className="modal-header">
                <h5 className="modal-title">Employee Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-4 text-center">
                    <img src={selectedEmployee.profilePicture ? `http://localhost:5000/uploads/${selectedEmployee.profilePicture}` : 'https://via.placeholder.com/100x100?text=No+Image'} alt="Profile" className="rounded-circle mb-3" width="100" height="100" />
                    <h5>{selectedEmployee.firstName} {selectedEmployee.lastName}</h5>
                    <p className="text-muted">{selectedEmployee.role}</p>
                  </div>
                  <div className="col-md-8">
                    <table className="table table-bordered">
                      <tbody>
                        <tr><th>Email</th><td>{selectedEmployee.email}</td></tr>
                        <tr><th>Phone</th><td>{selectedEmployee.phone}</td></tr>
                        <tr><th>Department</th><td>{selectedEmployee.department}</td></tr>
                        <tr><th>Status</th><td>{selectedEmployee.status}</td></tr>
                        <tr><th>Salary</th><td>{selectedEmployee.salary}</td></tr>
                        <tr><th>Joining Date</th><td>{selectedEmployee.joiningDate?.split("T")[0]}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowViewModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;


