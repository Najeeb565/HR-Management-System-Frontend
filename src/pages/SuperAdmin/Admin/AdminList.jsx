import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Filter, MoreVertical, UserCog, Mail, Building2, Shield, UserX, UserCheck } from 'lucide-react';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/superadmin/admins?page=${currentPage}&limit=10`);
      setAdmins(response.data.data);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      toast.error('Failed to fetch administrators');
      console.error('Error fetching administrators:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [currentPage]);

  const handleStatusChange = async (adminId, isActive) => {
    try {
      await axios.put(`http://localhost:5000/api/superadmin/admins/${adminId}/status`, {
        isActive
      });
      toast.success('Administrator status updated successfully');
      fetchAdmins();
    } catch (error) {
      toast.error('Failed to update administrator status');
      console.error('Error updating administrator status:', error);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'superAdmin':
        return 'bg-purple-100 text-purple-700 border border-purple-300';
      case 'companyAdmin':
        return 'bg-primary-subtle text-primary border border-primary';
      default:
        return 'bg-secondary-subtle text-secondary border border-secondary';
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="mb-5">
          <h1 className="display-4 fw-bold text-dark" style={{ background: 'linear-gradient(to right, #0d6efd, #6610f2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Administrators
          </h1>
          <p className="lead text-muted mt-2">
            Manage system administrators and their permissions
          </p>
        </div>

        <div className="card shadow-lg border-0 mb-5">
          <div className="card-body p-4">
            <div className="row g-3 align-items-center">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Search className="text-muted" size={20} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="form-control border-start-0 rounded-end py-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <Filter className="text-primary" size={20} />
                  </span>
                  <select
                    className="form-select rounded-end py-2"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    <option value="all">All Roles</option>
                    <option value="superAdmin">Super Admin</option>
                    <option value="companyAdmin">Company Admin</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="card shadow-lg border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-uppercase text-muted small fw-bold">Administrator</th>
                      <th scope="col" className="px-4 py-3 text-uppercase text-muted small fw-bold">Role</th>
                      <th scope="col" className="px-4 py-3 text-uppercase text-muted small fw-bold">Company</th>
                      <th scope="col" className="px-4 py-3 text-uppercase text-muted small fw-bold">Status</th>
                      <th scope="col" className="px-4 py-3 text-uppercase text-muted small fw-bold text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((admin) => (
                      <tr key={admin._id} className="align-middle" style={{ transition: 'background-color 0.2s ease' }}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 rounded-circle p-2" style={{ background: 'linear-gradient(to bottom right, #6610f2, #0d6efd)' }}>
                              <UserCog className="text-white" size={24} />
                            </div>
                            <div className="ms-3">
                              <div className="fw-semibold text-dark">{admin.name}</div>
                              <div className="d-flex align-items-center text-muted small">
                                <Mail className="me-1" size={16} />
                                {admin.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${getRoleBadgeColor(admin.role)} d-flex align-items-center gap-2 py-2 px-3 rounded-pill`}>
                            <Shield className="me-1" size={16} />
                            {admin.role === 'superAdmin' ? 'Super Admin' : 'Company Admin'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {admin.companyId ? (
                            <div className="d-flex align-items-center">
                              <Building2 className="text-muted me-2" size={20} />
                              <div className="text-dark">{admin.companyName}</div>
                            </div>
                          ) : (
                            <span className="text-muted small">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${admin.isActive ? 'bg-success-subtle text-success border border-success' : 'bg-danger-subtle text-danger border border-danger'} d-flex align-items-center gap-2 py-2 px-3 rounded-pill`}>
                            {admin.isActive ? (
                              <UserCheck className="me-1" size={16} />
                            ) : (
                              <UserX className="me-1" size={16} />
                            )}
                            {admin.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-end">
                          <div className="dropdown">
                            <button
                              className="btn btn-light rounded-circle"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              style={{ transition: 'all 0.3s ease' }}
                            >
                              <MoreVertical className="text-muted" size={20} />
                            </button>
                            <ul className="dropdown-menu shadow border-0">
                              <li>
                                <button
                                  className="dropdown-item d-flex align-items-center"
                                  onClick={() => handleStatusChange(admin._id, !admin.isActive)}
                                >
                                  {admin.isActive ? (
                                    <>
                                      <UserX className="text-danger me-2" size={16} />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="text-success me-2" size={16} />
                                      Activate
                                    </>
                                  )}
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="card-footer bg-light border-top-0 p-4">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">
                  Showing page {currentPage} of {totalPages}
                </span>
                <div className="d-flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="btn btn-outline-primary px-4"
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="btn btn-outline-primary px-4"
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminList;