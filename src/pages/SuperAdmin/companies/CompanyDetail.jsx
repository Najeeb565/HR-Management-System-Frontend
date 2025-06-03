import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageHeader from '../Layout/PageHeader';

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCompanyDetails();
  }, [id]);

  const fetchCompanyDetails = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockCompany = {
        _id: id,
        name: 'Tech Corp',
        email: 'contact@techcorp.com',
        phone: '(123) 456-7890',
        address: {
          street: '123 Tech Street',
          city: 'Silicon Valley',
          state: 'CA',
          zipCode: '94025',
          country: 'USA'
        },
        website: 'https://techcorp.com',
        industry: 'Technology',
        employeeCount: 150,
        status: 'approved',
        registrationDate: new Date(),
        description: 'Leading technology solutions provider',
        logo: 'https://via.placeholder.com/150'
      };
      setCompany(mockCompany);
    } catch (error) {
      toast.error('Failed to fetch company details');
      navigate('/companies');
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="fade-in">
      <PageHeader 
        title="Company Details"
        breadcrumbs={[
          { label: 'Companies', link: '/companies' },
          { label: company.name }
        ]}
      />

      <div className="row">
        <div className="col-lg-8">
          <div className="card dashboard-card mb-4">
            <div className="card-body">
              <div className="d-flex align-items-center mb-4">
                <img 
                  src={company.logo} 
                  alt={company.name} 
                  className="rounded-circle me-3"
                  style={{ width: '64px', height: '64px' }}
                />
                <div>
                  <h4 className="mb-1">{company.name}</h4>
                  <span className={`badge ${
                    company.status === 'approved' ? 'bg-success' :
                    company.status === 'pending' ? 'bg-warning' :
                    company.status === 'rejected' ? 'bg-danger' :
                    'bg-secondary'
                  }`}>
                    {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                  </span>
                </div>
              </div>

              <h5 className="card-title">Basic Information</h5>
              <div className="row mb-4">
                <div className="col-sm-3">
                  <strong className="text-muted">Industry</strong>
                </div>
                <div className="col-sm-9">
                  {company.industry}
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-sm-3">
                  <strong className="text-muted">Description</strong>
                </div>
                <div className="col-sm-9">
                  {company.description}
                </div>
              </div>

              <h5 className="card-title">Contact Information</h5>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong className="text-muted">Email</strong>
                </div>
                <div className="col-sm-9">
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong className="text-muted">Phone</strong>
                </div>
                <div className="col-sm-9">
                  <a href={`tel:${company.phone}`}>{company.phone}</a>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong className="text-muted">Website</strong>
                </div>
                <div className="col-sm-9">
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    {company.website}
                  </a>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong className="text-muted">Address</strong>
                </div>
                <div className="col-sm-9">
                  {company.address.street}<br />
                  {company.address.city}, {company.address.state} {company.address.zipCode}<br />
                  {company.address.country}
                </div>
              </div>
            </div>
          </div>

          <div className="card dashboard-card">
            <div className="card-body">
              <h5 className="card-title mb-4">Actions</h5>
              
              <div className="d-flex gap-2">
                <button className="btn btn-primary">
                  <i className="bi bi-pencil me-2"></i>
                  Edit Details
                </button>
                <button className="btn btn-info">
                  <i className="bi bi-people me-2"></i>
                  Manage Admins
                </button>
                {company.status === 'pending' && (
                  <>
                    <button className="btn btn-success">
                      <i className="bi bi-check-lg me-2"></i>
                      Approve
                    </button>
                    <button className="btn btn-danger">
                      <i className="bi bi-x-lg me-2"></i>
                      Reject
                    </button>
                  </>
                )}
                {company.status === 'approved' && (
                  <button className="btn btn-warning">
                    <i className="bi bi-slash-circle me-2"></i>
                    Block
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card dashboard-card mb-4">
            <div className="card-body">
              <h5 className="card-title">Company Statistics</h5>
              
              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>Employees</span>
                  <span className="fw-bold">{company.employeeCount}</span>
                </div>
                <div className="progress" style={{ height: '4px' }}>
                  <div 
                    className="progress-bar" 
                    style={{ width: `${Math.min((company.employeeCount / 200) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>Registration Date</span>
                  <span>{new Date(company.registrationDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between mb-1">
                  <span>Last Updated</span>
                  <span>2 days ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card dashboard-card">
            <div className="card-body">
              <h5 className="card-title">Recent Activity</h5>
              
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker bg-primary"></div>
                  <div className="timeline-content">
                    <div className="timeline-heading">
                      <span className="badge bg-primary">Update</span>
                      <small className="text-muted ms-2">2 hours ago</small>
                    </div>
                    <p className="mb-0">Company details updated</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-marker bg-success"></div>
                  <div className="timeline-content">
                    <div className="timeline-heading">
                      <span className="badge bg-success">Employee</span>
                      <small className="text-muted ms-2">Yesterday</small>
                    </div>
                    <p className="mb-0">New employee added</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-marker bg-info"></div>
                  <div className="timeline-content">
                    <div className="timeline-heading">
                      <span className="badge bg-info">Admin</span>
                      <small className="text-muted ms-2">3 days ago</small>
                    </div>
                    <p className="mb-0">New admin assigned</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetail;