import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../axios';
import { toast } from 'react-hot-toast';
import { CompanyContext } from '../../context/CompanyContext'
const AddEmployee = () => {
  const navigate = useNavigate();
  const { companySlug } = useParams();
  const { id } = useParams();
  const isEditMode = !!id;
  const { companyId } = useContext(CompanyContext)
  // console.log(companyId)

  console.log(CompanyContext)
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'Employee',
    department: '',
    salary: '',
    status: 'Active',
    joiningDate: new Date().toISOString().split('T')[0],
  });

  const roles = ['Employee', 'Manager', 'HR'];
  const statuses = ['Active', 'Inactive'];
  const departments = ['IT', 'HR', 'Finance', 'Marketing', 'Sales', 'Operations'];

  useEffect(() => {
    if (isEditMode) {
      const fetchEmployee = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/employees/${id}`);
          const data = response.data;

          setFormData({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            email: data.email || '',
            phone: data.phone || '',
            role: data.role || 'Employee',
            department: data.department || '',
            salary: data.salary || '',
            status: data.status || 'Active',
            joiningDate: data.joiningDate ? data.joiningDate.split('T')[0] : new Date().toISOString().split('T')[0],
          });
        } catch (err) {
          console.error('Error fetching employee:', err);
          toast.error('Error loading employee data');
        }
      };

      fetchEmployee();
    }
  }, [id, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...formData, companyId };
    console.log("companyId from context:", companyId);


    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/employees/${id}`, payload, {
          headers: {
            'Content-Type': 'application/json',

          }
        });
        toast.success('Employee updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/employees', payload, {
          headers: {
            'Content-Type': 'application/json',

          }
        });
        toast.success('Employee created successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: 'Employee',
          department: '',
          salary: '',
          status: 'Active',
          joiningDate: new Date().toISOString().split('T')[0],
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(isEditMode ? 'Error updating employee' : 'Error creating employee');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">{isEditMode ? 'Edit Employee' : 'Add New Employee'}</h1>
        <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(`/${companySlug}/company-dashboard/employees`)}>
          <i className="bi bi-arrow-left me-2"></i> Back to List
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card dashboard-card">
            <div className="card-header bg-white">
              <h5 className="card-title mb-0">
                <i className="bi bi-person-plus me-2"></i>Employee Information
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">First Name *</label>
                    <input type="text" className="form-control" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Last Name *</label>
                    <input type="text" className="form-control" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email *</label>
                    <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone *</label>
                    <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleInputChange} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Role *</label>
                    <select className="form-select" name="role" value={formData.role} onChange={handleInputChange} required>
                      {roles.map(role => <option key={role} value={role}>{role}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Department *</label>
                    <select className="form-select" name="department" value={formData.department} onChange={handleInputChange} required>
                      <option value="">Select Department</option>
                      {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Salary *</label>
                    <input type="number" className="form-control" name="salary" value={formData.salary} onChange={handleInputChange} min="0" required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Status *</label>
                    <select className="form-select" name="status" value={formData.status} onChange={handleInputChange} required>
                      {statuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Joining Date *</label>
                    <input type="date" className="form-control" name="joiningDate" value={formData.joiningDate} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Employee' : 'Create Employee')}
                  </button>
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate('/employees')}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
