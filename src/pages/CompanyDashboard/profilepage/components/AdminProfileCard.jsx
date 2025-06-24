import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Mail, Phone, MapPin, Upload, Edit2, Save } from 'lucide-react';

const AdminProfilePage = () => {
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email; // ✅ get email from localStorage
      if (!email) return console.error("Admin email not found in localStorage");

      const res = await axios.get(`/api/admin/profile/${email}`); // ✅ fix here
      setAdmin(res.data);
      setFormData(res.data);
      setPreview(res.data.profilePic);
      console.log("Fetched admin:", res.data);

    } catch (err) {
      console.error('Failed to fetch profile:', err);
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
      setPreview(reader.result); // base64 preview
      setFormData({ ...formData, profilePic: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;
      await axios.put(`/api/admin/profile/${email}`, formData); // ✅ email in URL
      setAdmin(formData);
      setEditMode(false);
      alert('Profile updated successfully');
    } catch (err) {
      console.error('Failed to update:', err);
    }
  };


  if (!admin) return <p className="text-center mt-5">Loading profile...</p>;

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
        <h4 className="mb-0">Admin Profile</h4>
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
          <label className="form-label"><User size={16} className="me-1" /> Name</label>
          <input
            className="form-control"
            name="name"
            value={formData.name || ""}
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
            name="phoneNumber"
            value={formData.phoneNumber || ""}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label"><MapPin size={16} className="me-1" /> Address</label>
          <input
            className="form-control"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">🎂 Date of Birth</label>
          <input
            type="date"
            className="form-control"
            name="dateOfBirth"
            value={formData.dateOfBirth?.split('T')[0] || ""}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
      </div>

      {/* Employment Section */}
      <h5 className="border-bottom pb-2 mt-4 mb-3 text-success">Employment Details</h5>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">📅 Joining Date</label>
          <input
            type="date"
            className="form-control"
            name="hireDate"
            value={formData.hireDate?.split('T')[0] || ""}
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
      </div>
    </div>
  </div>
);

};

export default AdminProfilePage;
