import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import SearchFilter from '../../components/common/SearchFilter';
import EmptyState from '../../components/common/EmptyState';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      // Mock data for demonstration
      const mockAdmins = [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'super-admin',
          lastLogin: new Date(),
          isBlocked: false
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'company-admin',
          lastLogin: new Date(),
          isBlocked: false
        }
      ];
      setAdmins(mockAdmins);
    } catch (error) {
      toast.error('Failed to fetch admins');
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

  return (
    <div className="fade-in">
      <PageHeader 
        title="Admins"
        buttonText="Add Admin"
        buttonIcon="bi-plus-circle"
        buttonLink="/admins/new"
      />
      
      <SearchFilter 
        onSearch={() => {}}
        filters={[
          {
            name: 'role',
            placeholder: 'Filter by Role',
            options: [
              { value: 'super-admin', label: 'Super Admin' },
              { value: 'company-admin', label: 'Company Admin' }
            ]
          }
        ]}
      />

      <div className="card dashboard-card">
        <div className="card-body">
          {admins.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Last Login</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map(admin => (
                    <tr key={admin._id}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>
                        <span className={`badge ${admin.role === 'super-admin' ? 'bg-primary' : 'bg-info'}`}>
                          {admin.role === 'super-admin' ? 'Super Admin' : 'Company Admin'}
                        </span>
                      </td>
                      <td>{new Date(admin.lastLogin).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${admin.isBlocked ? 'bg-danger' : 'bg-success'}`}>
                          {admin.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <Link to={`/admins/${admin._id}`} className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-eye"></i>
                          </Link>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState 
              icon="bi-people"
              title="No Admins Found"
              message="There are no administrators in the system yet."
              buttonText="Add Admin"
              buttonIcon="bi-plus-circle"
              buttonLink="/admins/new"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminList;