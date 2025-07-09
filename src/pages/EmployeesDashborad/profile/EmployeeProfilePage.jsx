import React, { useEffect, useState, useContext } from 'react';
import axios from "../../../axios";
import { 
  User, Mail, Phone, MapPin, Upload, Edit2, Save, Briefcase, 
  Users, Calendar, DollarSign, ChevronDown, ChevronUp, 
  Shield, Info, FileText, Clock, Award, GitBranch
} from 'lucide-react';
import { CompanyContext } from "../../../context/CompanyContext";
import { toast } from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

const EmployeeProfilePage = () => {
  const { company } = useContext(CompanyContext);
  const [employee, setEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const [activeSection, setActiveSection] = useState(['personal', 'employment']);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      fetchProfile(user.email);
    }
  }, []);

  const fetchProfile = async (email) => {
    try {
      const res = await axios.get(`/profile/${email}`);
      setEmployee(res.data);
      setFormData(res.data);
      setPreview(res.data.profilePicture);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      toast.error("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({ ...formData, profilePicture: file });

    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;

      const form = new FormData();
      const cleanedFormData = { ...formData };
      
      // Remove sensitive/non-editable fields
      delete cleanedFormData.password;
      delete cleanedFormData.otp;
      delete cleanedFormData.otpExpire;

      for (let key in cleanedFormData) {
        form.append(key, cleanedFormData[key]);
      }

      const res = await axios.put(`/profile/${email}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = {
        ...user,
        ...res.data,
        name: res.data.firstName,
        role: res.data.role?.toLowerCase(),
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEmployee(updatedUser);
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update:", err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  const toggleSection = (section) => {
    if (activeSection.includes(section)) {
      setActiveSection(activeSection.filter(s => s !== section));
    } else {
      setActiveSection([...activeSection, section]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (!employee) return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-lg-4">
          {/* Profile Card */}
          <div className="card shadow-sm mb-4">
            <div className="card-body text-center">
              <div className="position-relative d-inline-block">
                <img
                  src={
                    preview?.startsWith("blob:")
                      ? preview
                      : preview
                        ? `http://localhost:5000/uploads/${preview}`
                        : "/default-avatar.png"
                  }
                  alt="Profile"
                  className="rounded-circle border border-3 border-primary"
                  style={{ 
                    width: 150, 
                    height: 150, 
                    objectFit: 'cover',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}
                />
                {editMode && (
                  <label 
                    className="position-absolute bottom-0 end-0 bg-primary rounded-circle p-2 cursor-pointer"
                    style={{ transform: 'translate(25%, 25%)' }}
                    title="Change photo"
                  >
                    <Upload size={18} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="d-none"
                    />
                  </label>
                )}
              </div>

              <h3 className="mt-3 mb-1">{formData.firstName} {formData.lastName}</h3>
              <p className="text-muted mb-2">
                <Briefcase size={14} className="me-1" />
                {formData.role} • {formData.department}
              </p>
              <div className={`badge bg-${formData.status === 'Active' ? 'success' : formData.status === 'Inactive' ? 'warning' : 'danger'} text-white`}>
                {formData.status || 'N/A'}
              </div>

              <div className="mt-3">
                <button
                  className={`btn btn-sm ${editMode ? 'btn-success' : 'btn-outline-primary'}`}
                  onClick={() => (editMode ? handleSubmit() : setEditMode(true))}
                >
                  {editMode ? (
                    <>
                      <Save size={16} className="me-1" /> Save Changes
                    </>
                  ) : (
                    <>
                      <Edit2 size={16} className="me-1" /> Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h6 className="mb-0"><Info size={16} className="me-2" />Quick Information</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0">
                <li className="mb-2 d-flex">
                  <Mail size={16} className="me-2 text-muted" />
                  <span>{formData.email}</span>
                </li>
                <li className="mb-2 d-flex">
                  <Phone size={16} className="me-2 text-muted" />
                  <span>{formData.phone || 'N/A'}</span>
                </li>
                <li className="mb-2 d-flex">
                  <Calendar size={16} className="me-2 text-muted" />
                  <span>Joined {formatDate(formData.joiningDate)}</span>
                </li>
                <li className="d-flex">
                  <DollarSign size={16} className="me-2 text-muted" />
                  <span>Salary: {formData.salary ? `$${formData.salary.toLocaleString()}` : 'N/A'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          {/* Personal Information Section */}
          <div className="card shadow-sm mb-4">
            <div 
              className="card-header bg-light d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => toggleSection('personal')}
            >
              <h6 className="mb-0"><User size={16} className="me-2" />Personal Information</h6>
              {activeSection.includes('personal') ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            {activeSection.includes('personal') && (
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small text-muted">First Name</label>
                    <div className="input-group">
                      <span className="input-group-text"><User size={16} /></span>
                      <input
                        className="form-control"
                        name="firstName"
                        value={formData.firstName || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small text-muted">Last Name</label>
                    <div className="input-group">
                      <span className="input-group-text"><User size={16} /></span>
                      <input
                        className="form-control"
                        name="lastName"
                        value={formData.lastName || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small text-muted">Date of Birth</label>
                    <div className="input-group">
                      <span className="input-group-text"><Calendar size={16} /></span>
                      <input
                        type="date"
                        className="form-control"
                        name="dateOfBirth"
                        value={
                          formData.dateOfBirth
                            ? new Date(formData.dateOfBirth).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small text-muted">Phone Number</label>
                    <div className="input-group">
                      <span className="input-group-text"><Phone size={16} /></span>
                      <input
                        className="form-control"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Employment Details Section */}
          <div className="card shadow-sm mb-4">
            <div 
              className="card-header bg-light d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => toggleSection('employment')}
            >
              <h6 className="mb-0"><Briefcase size={16} className="me-2" />Employment Details</h6>
              {activeSection.includes('employment') ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            {activeSection.includes('employment') && (
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small text-muted">Role</label>
                    <div className="input-group">
                      <span className="input-group-text"><Shield size={16} /></span>
                      <select
                        className="form-select"
                        name="role"
                        value={formData.role || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                      >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="HR">HR</option>
                        <option value="Admin">Admin</option>
                        <option value="Executive">Executive</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small text-muted">Department</label>
                    <div className="input-group">
                      <span className="input-group-text"><GitBranch size={16} /></span>
                      <select
                        className="form-select"
                        name="department"
                        value={formData.department || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                      >
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Operations">Operations</option>
                        <option value="Admin">Admin</option>
                        <option value="R&D">Research & Development</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small text-muted">Joining Date</label>
                    <div className="input-group">
                      <span className="input-group-text"><Clock size={16} /></span>
                      <input
                        type="date"
                        className="form-control"
                        name="joiningDate"
                        value={formData.joiningDate?.split('T')[0] || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small text-muted">Salary</label>
                    <div className="input-group">
                      <span className="input-group-text"><DollarSign size={16} /></span>
                      <input
                        type="number"
                        className="form-control"
                        name="salary"
                        value={formData.salary || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small text-muted">Employment Status</label>
                    <div className="input-group">
                      <span className="input-group-text"><FileText size={16} /></span>
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                        <option value="Terminated">Terminated</option>
                        <option value="Retired">Retired</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Information Section */}
          <div className="card shadow-sm">
            <div 
              className="card-header bg-light d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => toggleSection('additional')}
            >
              <h6 className="mb-0"><Award size={16} className="me-2" />Additional Information</h6>
              {activeSection.includes('additional') ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            {activeSection.includes('additional') && (
              <div className="card-body">
                <div className="row">
                  <div className="col-md-12 mb-3">
                    <label className="form-label small text-muted">Emergency Contact</label>
                    <input
                      className="form-control"
                      name="emergencyContact"
                      value={formData.emergencyContact || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="Name and phone number"
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label small text-muted">Notes</label>
                    <textarea
                      className="form-control"
                      name="notes"
                      rows="3"
                      value={formData.notes || ""}
                      onChange={handleChange}
                      disabled={!editMode}
                      placeholder="Additional notes about the employee"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;