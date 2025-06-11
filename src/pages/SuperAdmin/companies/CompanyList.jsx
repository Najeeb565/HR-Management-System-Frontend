import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Filter, MoreVertical, CheckCircle, XCircle, AlertCircle, Ban, Building2, Users, MapPin } from 'lucide-react';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/companies?page=${currentPage}&limit=10`);
      setCompanies(response.data.data);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      toast.error('Failed to fetch companies');
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [currentPage]);

  const handleStatusChange = async (companyId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/companies/${companyId}/status`, {
        status: newStatus
      });
      toast.success('Company status updated successfully');
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to update company status');
      console.error('Error updating company status:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-danger" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'blocked':
        return <Ban className="w-5 h-5 text-secondary" />;
      default:
        return null;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success-subtle text-success border border-success';
      case 'rejected':
        return 'bg-danger-subtle text-danger border border-danger';
      case 'pending':
        return 'bg-warning-subtle text-warning border border-warning';
      case 'blocked':
        return 'bg-secondary-subtle text-secondary border border-secondary';
      default:
        return 'bg-secondary-subtle text-secondary border border-secondary';
    }
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="mb-5">
          <h1 className="display-4 fw-bold text-dark" style={{ background: 'linear-gradient(to right, #0d6efd, #6610f2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Company Dashboard
          </h1>
          <p className="lead text-muted mt-2">
            Explore and manage all registered companies with ease
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
                    placeholder="Search companies or owners..."
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
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="blocked">Blocked</option>
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
                      <th scope="col" className="px-4 py-3 text-uppercase text-muted small fw-bold">Company</th>
                      <th scope="col" className="px-4 py-3 text-uppercase text-muted small fw-bold">Owner</th>
                      <th scope="col" className="px-4 py-3 text-uppercase text-muted small fw-bold">Status</th>
                      <th scope="col" className="px-4 py-3 text-uppercase text-muted small fw-bold">Location</th>
                      <th scope="col" className="px-4 py-3 text-uppercase text-muted small fw-bold text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((company) => (
                      <tr key={company._id} className="align-middle" style={{ transition: 'background-color 0.2s ease' }}>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 rounded-circle p-2" style={{ background: 'linear-gradient(to bottom right, #0d6efd, #6610f2)' }}>
                              <Building2 className="text-white" size={24} />
                            </div>
                            <div className="ms-3">
                              <div className="fw-semibold text-dark">{company.companyName}</div>
                              <div className="text-muted small">{company.companyEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <Users className="text-muted me-2" size={20} />
                            <div>
                              <div className="fw-medium text-dark">{company.ownerName}</div>
                              <div className="text-muted small">{company.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`badge ${getStatusBadgeColor(company.status)} d-flex align-items-center gap-2 py-2 px-3 rounded-pill`}>
                            {getStatusIcon(company.status)}
                            <span>{company.status.charAt(0).toUpperCase() + company.status.slice(1)}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="d-flex align-items-center">
                            <MapPin className="text-muted me-2" size={20} />
                            <div>
                              <div className="text-dark">{company.city}</div>
                              <div className="text-muted small">{company.country}</div>
                            </div>
                          </div>
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
                              <MoreVertical size={20} className="text-muted" />
                            </button>
                            <ul className="dropdown-menu shadow border-0">
                              {company.status !== 'approved' && (
                                <li>
                                  <button
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={() => handleStatusChange(company._id, 'approved')}
                                  >
                                    <CheckCircle className="text-success me-2" size={16} />
                                    Approve
                                  </button>
                                </li>
                              )}
                              {company.status !== 'rejected' && (
                                <li>
                                  <button
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={() => handleStatusChange(company._id, 'rejected')}
                                  >
                                    <XCircle className="text-danger me-2" size={16} />
                                    Reject
                                  </button>
                                </li>
                              )}
                              {company.status !== 'blocked' && (
                                <li>
                                  <button
                                    className="dropdown-item d-flex align-items-center"
                                    onClick={() => handleStatusChange(company._id, 'blocked')}
                                  >
                                    <Ban className="text-secondary me-2" size={16} />
                                    Block
                                  </button>
                                </li>
                              )}
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

export default CompanyList;