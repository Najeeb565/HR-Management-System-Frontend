import React, { useEffect, useState, useContext } from 'react';
import axios from "../../../../axios";
import { 
  User, Mail, Phone, MapPin, Upload, Edit2, Save, 
  Briefcase, Calendar, DollarSign, ChevronDown, 
  ChevronUp, Shield, Info, Clock, Award
} from 'lucide-react';
import { CompanyContext } from "../../../../context/CompanyContext";
import { toast } from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

const AdminProfilePage = () => {
  const { company, setCompany } = useContext(CompanyContext);
  const [admin, setAdmin] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [preview, setPreview] = useState(null);
  const [activeSection, setActiveSection] = useState(['personal', 'employment']);

  useEffect(() => {
    if (!company) return;
    if (company?.email) {
      fetchProfile();
    } else {
      console.warn("⚠️ Admin email is missing from context.");
    }
  }, [company]);

  const fetchProfile = async () => {
    try {
      const email = company?.email;
      if (!email) return console.error("Admin email not found in context");

      const res = await axios.get(`/admin/profile/${email}`);
      setAdmin(res.data);
      setFormData(res.data);
      setPreview(res.data.profilePic);
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

    setPreview(URL.createObjectURL(file));
    setFormData({ ...formData, profilePic: file });
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const email = user?.email;

      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "profilePic") return;

        // ✅ Skip null, undefined, or empty strings for date fields
        if ((key === "otpExpire" || key === "birthday" || key === "hireDate") && (!value || value === "null")) {
          return; // Don't append anything; backend will ignore it
        }

        data.append(key, value);
      });

      if (formData.profilePic instanceof File) {
        data.append("profilePic", formData.profilePic);
      }

      const res = await axios.put(`/admin/profile/${email}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      let updatedUser = res.data.updatedUser || res.data;
      updatedUser = {
        ...user,
        ...updatedUser,
        name: updatedUser.firstName || updatedUser.name,
        role: updatedUser.role?.toLowerCase(),
      };

      if (updatedUser.profilePic) {
        updatedUser.profilePicture = updatedUser.profilePic;
        delete updatedUser.profilePic;
      }

      delete updatedUser.password;
      delete updatedUser.otp;
      delete updatedUser.otpExpire;

      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (typeof setCompany === "function") {
        setCompany(updatedUser);
      }

      setAdmin(updatedUser);
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error(err.response?.data?.message || "Profile update failed");
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

  if (!admin) return (
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

              <h3 className="mt-3 mb-1">{formData.name || 'Admin User'}</h3>
              <p className="text-muted mb-2">
                <Shield size={14} className="me-1" />
                System Administrator
              </p>
              <div className="badge bg-success text-white">
                Active
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
                  <span>{formData.phoneNumber || 'N/A'}</span>
                </li>
                <li className="mb-2 d-flex">
                  <Calendar size={16} className="me-2 text-muted" />
                  <span>Joined {formatDate(formData.hireDate)}</span>
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
                    <label className="form-label small text-muted">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text"><User size={16} /></span>
                      <input
                        className="form-control"
                        name="name"
                        value={formData.name || ""}
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
                        value={formData.dateOfBirth?.split('T')[0] || ""}
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
                        name="phoneNumber"
                        value={formData.phoneNumber || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label small text-muted">Address</label>
                    <div className="input-group">
                      <span className="input-group-text"><MapPin size={16} /></span>
                      <input
                        className="form-control"
                        name="address"
                        value={formData.address || ""}
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
                    <label className="form-label small text-muted">Joining Date</label>
                    <div className="input-group">
                      <span className="input-group-text"><Clock size={16} /></span>
                      <input
                        type="date"
                        className="form-control"
                        name="hireDate"
                        value={formData.hireDate?.split('T')[0] || ""}
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
                </div>
              </div>
            )}
          </div>

          {/* System Access Section */}
          <div className="card shadow-sm">
            <div 
              className="card-header bg-light d-flex justify-content-between align-items-center cursor-pointer"
              onClick={() => toggleSection('access')}
            >
              <h6 className="mb-0"><Shield size={16} className="me-2" />System Access</h6>
              {activeSection.includes('access') ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
            {activeSection.includes('access') && (
              <div className="card-body">
                <div className="alert alert-info">
                  <Info size={16} className="me-2" />
                  You have full administrative privileges to all system modules and data.
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="card bg-light mb-3">
                      <div className="card-body">
                        <h6 className="card-title"><Award size={16} className="me-2" />Permissions</h6>
                        <ul className="list-unstyled small">
                          <li>• Full system configuration</li>
                          <li>• User management</li>
                          <li>• Data administration</li>
                          <li>• Security settings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h6 className="card-title"><Clock size={16} className="me-2" />Last Activities</h6>
                        <ul className="list-unstyled small">
                          <li>• System updated: Today</li>
                          <li>• User permissions modified: Yesterday</li>
                          <li>• Security audit: 3 days ago</li>
                        </ul>
                      </div>
                    </div>
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

export default AdminProfilePage;