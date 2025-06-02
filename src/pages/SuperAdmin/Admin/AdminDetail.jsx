import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';

const AdminDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminDetails();
  }, [id]);

  const fetchAdminDetails = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockAdmin = {
        _id: id,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'super-admin',
        lastLogin: new Date(),
        isBlocked: false,
        company: {
          name: 'Tech Corp',
          id: '123'
        }
      };
      setAdmin(mockAdmin);
    } catch (error) {
      toast.error('Failed to fetch admin details');
      navigate('/admins');
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

  if (!admin) {
    return null;
  }

  return (
    <div className="fade-in">
      <PageHeader 
        title="Admin Details"
        breadcrumbs={[
          { label: 'Admins', link: '/admins' },
          { label: admin.name }
        ]}
      />

      <div className="row">
        <div className="col-lg-8">
          <div className="card dashboard-card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4">Basic Information</h5>
              
              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong className="text-muted">Full Name</strong>
                </div>
                <div className="col-sm-9">
                  {admin.name}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong className="text-muted">Email</strong>
                </div>
                <div className="col-sm-9">
                  {admin.email}
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong className="text-muted">Role</strong>
                </div>
                <div className="col-sm-9">
                  <span className={`badge ${admin.role === 'super-admin' ? 'bg-primary' : 'bg-info'}`}>
                    {admin.role === 'super-admin' ? 'Super Admin' : 'Company Admin'}
                  </span>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong className="text-muted">Status</strong>
                </div>
                <div className="col-sm-9">
                  <span className={`badge ${admin.isBlocked ? 'bg-danger' : 'bg-success'}`}>
                    {admin.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>
              </div>

              {admin.company && (
                <div className="row mb-3">
                  <div className="col-sm-3">
                    <strong className="text-muted">Company</strong>
                  </div>
                  <div className="col-sm-9">
                    {admin.company.name}
                  </div>
                </div>
              )}

              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong className="text-muted">Last Login</strong>
                </div>
                <div className="col-sm-9">
                  {new Date(admin.lastLogin).toLocaleString()}
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
                <button className={`btn ${admin.isBlocked ? 'btn-success' : 'btn-danger'}`}>
                  <i className={`bi ${admin.isBlocked ? 'bi-unlock' : 'bi-lock'} me-2`}></i>
                  {admin.isBlocked ? 'Unblock Admin' : 'Block Admin'}
                </button>
                <button className="btn btn-outline-danger">
                  <i className="bi bi-trash me-2"></i>
                  Delete Admin
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card dashboard-card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4">Recent Activity</h5>
              
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-marker bg-primary"></div>
                  <div className="timeline-content">
                    <div className="timeline-heading">
                      <span className="badge bg-primary">Login</span>
                      <small className="text-muted ms-2">2 hours ago</small>
                    </div>
                    <p className="mb-0">Successfully logged in to the system</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-marker bg-success"></div>
                  <div className="timeline-content">
                    <div className="timeline-heading">
                      <span className="badge bg-success">Update</span>
                      <small className="text-muted ms-2">Yesterday</small>
                    </div>
                    <p className="mb-0">Updated company information</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-marker bg-info"></div>
                  <div className="timeline-content">
                    <div className="timeline-heading">
                      <span className="badge bg-info">Create</span>
                      <small className="text-muted ms-2">3 days ago</small>
                    </div>
                    <p className="mb-0">Created new employee account</p>
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

export default AdminDetail;