import React, { useEffect, useState, useContext } from 'react';
import axios from "../../../axios";
import { User, Mail, Phone, MapPin, Upload, Edit2, Save, Briefcase, Users } from 'lucide-react';
import { CompanyContext } from "../../../context/CompanyContext";
import { toast } from 'react-hot-toast';

const EmployeeProfilePage = () => {
  const { company } = useContext(CompanyContext);
  const [employee, setEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);

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
      console.error('Error details:', err.response?.data || err.message);
      toast.error("Failed to load profile");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setFormData({ ...formData, profilePicture: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;

    const res = await axios.put(`/profile/${email}`, formData);

    const prevUser = JSON.parse(localStorage.getItem("user"));
    const updatedUser = {
      ...prevUser,
      ...res.data,
      name: res.data.firstName,                
      role: res.data.role.toLowerCase()        
    };

    delete updatedUser.password;
    delete updatedUser.otp;
    delete updatedUser.otpExpire;

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setEmployee(updatedUser);
    setEditMode(false);
    toast.success("Profile updated successfully!");

  } catch (err) {
    console.error('Failed to update:', err);
    toast.error("Failed to update profile");
  }
};


  if (!employee) return <p className="text-center mt-5">Loading profile...</p>;

  return (
    <div className="container mt-5 mb-5">
      <div className="card shadow p-4">
        <div className="text-center mb-4">
          <img
            src={preview || '/default-avatar.png'}
            alt="Profile"
            className="rounded-circle border border-3"
            style={{ width: 150, height: 150, objectFit: 'cover' }}
          />
          {editMode && (
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="form-control form-control-sm"
                style={{ maxWidth: 250, margin: '0 auto' }}
              />
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Employee Profile</h4>
          <button
            className={`btn btn-sm ${editMode ? 'btn-success' : 'btn-outline-primary'}`}
            onClick={() => (editMode ? handleSubmit() : setEditMode(true))}
          >
            {editMode ? <><Save size={16} className="me-1" /> Save</> : <><Edit2 size={16} className="me-1" /> Edit</>}
          </button>
        </div>

        {/* Personal Section */}
        <h5 className="border-bottom pb-2 mb-3 text-primary">Personal Information</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label"><User size={16} className="me-1" /> First Name</label>
            <input
              className="form-control"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label"><User size={16} className="me-1" /> Last Name</label>
            <input
              className="form-control"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label"><Mail size={16} className="me-1" /> Email</label>
            <input
              className="form-control"
              value={formData.email}
              disabled
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label"><Phone size={16} className="me-1" /> Phone</label>
            <input
              className="form-control"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
        </div>

        {/* Employment Section */}
        <h5 className="border-bottom pb-2 mt-4 mb-3 text-success">Employment Details</h5>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label"><Briefcase size={16} className="me-1" /> Role</label>
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
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label"><Users size={16} className="me-1" /> Department</label>
            <select
              className="form-select"
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
              disabled={!editMode}
            >
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">📅 Joining Date</label>
            <input
              type="date"
              className="form-control"
              name="joiningDate"
              value={formData.joiningDate?.split('T')[0] || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">💰 Salary</label>
            <input
              type="number"
              className="form-control"
              name="salary"
              value={formData.salary || ""}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              disabled={!editMode}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;