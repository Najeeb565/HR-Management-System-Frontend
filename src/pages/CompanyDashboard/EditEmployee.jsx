import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const EditEmployee = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Employee',
    department: '',
    salary: '',
    status: 'Active',
    joiningDate: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  const roles = ['Employee', 'Manager', 'Admin', 'HR'];
  const statuses = ['Active', 'Inactive', 'Terminated'];
  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations', 'Admin'];

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
      const employee = response.data;
      
      setFormData({
        ...employee,
        joiningDate: new Date(employee.joiningDate).toISOString().split('T')[0],
        address: employee.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        }
      });

      if (employee.profilePicture) {
        setCurrentImage(`http://localhost:5000/uploads/${employee.profilePicture}`);
      }
    } catch (error) {
      console.error('Error fetching employee:', error);
      alert('Error loading employee data');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'address') {
          Object.keys(formData.address).forEach(addressKey => {
            submitData.append(`address.${addressKey}`, formData.address[addressKey]);
          });
        } else if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'employeeId') {
          submitData.append(key, formData[key]);
        }
      });

      // Append profile picture if selected
      if (profilePicture) {
        submitData.append('profilePicture', profilePicture);
      }

      await axios.put(`http://localhost:5000/api/employees/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/employees');
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Error updating employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
        <h1 className="h3 mb-0">Edit Employee</h1>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate('/employees')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to List
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card dashboard-card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-pencil me-2"></i>
                Employee Information
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Employee ID Display */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Employee ID</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      value={formData.employeeId || ''}
                      disabled
                    />
                  </div>

                  {/* Basic Information */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-control form-control-custom"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone *</label>
                    <input
                      type="tel"
                      className="form-control form-control-custom"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Job Information */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Role *</label>
                    <select
                      className="form-select form-control-custom"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Department *</label>
                    <select
                      className="form-select form-control-custom"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Salary *</label>
                    <input
                      type="number"
                      className="form-control form-control-custom"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      min="0"
                      step="100"
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status *</label>
                    <select
                      className="form-select form-control-custom"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Joining Date *</label>
                    <input
                      type="date"
                      className="form-control form-control-custom"
                      name="joiningDate"
                      value={formData.joiningDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Address Information */}
                  <div className="col-12 mb-3">
                    <h6 className="border-bottom pb-2">Address Information</h6>
                  </div>
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Street Address</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      name="address.street"
                      value={formData.address?.street || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      name="address.city"
                      value={formData.address?.city || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      name="address.state"
                      value={formData.address?.state || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Zip Code</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      name="address.zipCode"
                      value={formData.address?.zipCode || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control form-control-custom"
                      name="address.country"
                      value={formData.address?.country || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary btn-custom"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Update Employee
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-custom"
                    onClick={() => navigate('/employees')}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Profile Picture Upload */}
        <div className="col-lg-4">
          <div className="card dashboard-card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-image me-2"></i>
                Profile Picture
              </h5>
            </div>
            <div className="card-body text-center">
              <div className="mb-3">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="profile-avatar"
                  />
                ) : currentImage ? (
                  <img
                    src={currentImage}
                    alt="Current"
                    className="profile-avatar"
                  />
                ) : (
                  <div
                    className="profile-avatar mx-auto d-flex align-items-center justify-content-center bg-light"
                  >
                    <i className="bi bi-person fs-1 text-muted"></i>
                  </div>
                )}
              </div>
              <input
                type="file"
                className="form-control form-control-custom"
                accept="image/*"
                onChange={handleFileChange}
              />
              <small className="text-muted mt-2 d-block">
                Max file size: 5MB<br />
                Supported formats: JPG, PNG, GIF<br />
                {currentImage && !previewImage && 'Leave empty to keep current image'}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;