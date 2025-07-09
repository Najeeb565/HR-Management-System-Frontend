import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    companyStats: {
      total: 0,
      active: 0,
      pending: 0,
      blocked: 0
    },
    userStats: {
      total: 0,
      active: 0,
      inactive: 0,
      newThisMonth: 0
    },
    monthlyData: {
      labels: [],
      companies: [],
      users: [],
      revenue: []
    }
  });
  const [pendingCompanies, setPendingCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard`),
        axios.get(`${API_URL}/companies?status=pending`)
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      if (pendingRes.data.success) {
        setPendingCompanies(pendingRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    }
    setIsLoading(false);
  };

  const handleStatusChange = async (companyId, status) => {
    try {
      const response = await axios.put(`${API_URL}/companies/${companyId}/status`, { status });
      if (response.data.success) {
        toast.success(`Company status updated to ${status}`);
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error updating company status:', error);
      toast.error('Failed to update company status');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const lineChartData = {
    labels: stats.monthlyData?.labels || [],
    datasets: [
      {
        label: 'New Companies',
        data: stats.monthlyData?.companies || [],
        fill: false,
        backgroundColor: 'rgba(13, 110, 253, 0.2)',
        borderColor: 'rgba(13, 110, 253, 1)',
        tension: 0.4
      }
    ]
  };

  const doughnutChartData = {
    labels: ['Approved', 'Pending', 'Rejected', 'Blocked'],
    datasets: [
      {
        data: [
          stats.companyStats?.active || 0,
          stats.companyStats?.pending || 0,
          0, // Rejected (not provided in current stats)
          stats.companyStats?.blocked || 0
        ],
        backgroundColor: [
          'rgba(25, 135, 84, 0.6)',
          'rgba(255, 193, 7, 0.6)',
          'rgba(220, 53, 69, 0.6)',
          'rgba(108, 117, 125, 0.6)'
        ],
        borderColor: [
          'rgba(25, 135, 84, 1)',
          'rgba(255, 193, 7, 1)',
          'rgba(220, 53, 69, 1)',
          'rgba(108, 117, 125, 1)'
        ],
        borderWidth: 1
      }
    ]
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Super Admin Dashboard</h1>
    
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="card dashboard-card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="card-icon bg-primary-subtle text-primary">
                  <i className="bi bi-building"></i>
                </div>
                <div>
                  <h6 className="card-title text-muted mb-0">Total Companies</h6>
                  <h2 className="mt-2 mb-0">{stats.companyStats.total}</h2>
                </div>
              </div>
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex align-items-center">
                  <span className="badge bg-success me-2">
                    <i className="bi bi-arrow-up"></i> {stats.companyStats.active}
                  </span>
                  <span className="text-muted small">active companies</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card dashboard-card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="card-icon bg-success-subtle text-success">
                  <i className="bi bi-people"></i>
                </div>
                <div>
                  <h6 className="card-title text-muted mb-0">Total Admins</h6>
                  <h2 className="mt-2 mb-0">{stats.userStats.total}</h2>
                </div>
              </div>
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex align-items-center">
                  <span className="me-2">Active:</span>
                  <span className="fw-bold">{stats.userStats.active}</span>
                  <span className="mx-2">|</span>
                  <span className="me-2">Inactive:</span>
                  <span className="fw-bold">{stats.userStats.inactive}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card dashboard-card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="card-icon bg-warning-subtle text-warning">
                  <i className="bi bi-person-badge"></i>
                </div>
                <div>
                  <h6 className="card-title text-muted mb-0">New This Month</h6>
                  <h2 className="mt-2 mb-0">{stats.userStats.newThisMonth}</h2>
                </div>
              </div>
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex align-items-center">
                  <span className="text-muted small">
                    New registrations in the last 30 days
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card dashboard-card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="card-icon bg-danger-subtle text-danger">
                  <i className="bi bi-clock-history"></i>
                </div>
                <div>
                  <h6 className="card-title text-muted mb-0">Pending Approvals</h6>
                  <h2 className="mt-2 mb-0">{stats.companyStats.pending}</h2>
                </div>
              </div>
              <div className="mt-3 pt-3 border-top">
                <Link to="/companies?status=pending" className="text-primary text-decoration-none">
                  View pending requests <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="card dashboard-card h-100">
            <div className="card-header bg-transparent">
              <h5 className="card-title mb-0">Company Registrations</h5>
            </div>
            <div className="card-body">
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { position: 'top' } },
                  scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
                }}
                height={250}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card dashboard-card h-100">
            <div className="card-header bg-transparent">
              <h5 className="card-title mb-0">Companies by Status</h5>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
              <div style={{ maxHeight: '250px', width: '100%' }}>
                <Doughnut
                  data={doughnutChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card dashboard-card h-100">
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Recent Activity</h5>
              <Link to="/security-logs" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {pendingCompanies.slice(0, 5).map(company => (
                  <li key={company._id} className="list-group-item px-0 py-3 d-flex justify-content-between align-items-start">
                    <div>
                      <div className="d-flex align-items-center">
                        <span className="me-2 p-1 rounded-circle bg-info-subtle">
                          <i className="bi bi-building-add text-info"></i>
                        </span>
                        <span>New company <strong>{company.companyName}</strong> registered</span>
                      </div>
                      <small className="text-muted">{new Date(company.createdAt).toLocaleString()}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card dashboard-card h-100">
            <div className="card-header bg-transparent d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Pending Companies</h5>
              <Link to="/companies?status=pending" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Company</th>
                      <th>Owner</th>
                      <th>Email</th>
                      <th>Industry</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCompanies.map(company => (
                      <tr key={company._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="bg-primary text-white rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                              <span>{company.companyName.slice(0, 2).toUpperCase()}</span>
                            </div>
                            <div>
                              <h6 className="mb-0">{company.companyName}</h6>
                              <small className="text-muted">{company.industry}</small>
                            </div>
                          </div>
                        </td>
                        <td>{company.ownerName}</td>
                        <td>{company.companyEmail}</td>
                        <td>{company.industry}</td>
                        <td>{new Date(company.createdAt).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              className="btn btn-success"
                              onClick={() => handleStatusChange(company._id, 'approved')}
                            >
                              <i className="bi bi-check-lg"></i> Approve
                            </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleStatusChange(company._id, 'rejected')}
                            >
                              <i className="bi bi-x-lg"></i> Reject
                            </button>
                            <button
                              className="btn btn-warning"
                              onClick={() => handleStatusChange(company._id, 'pending')}
                            >
                              <i className="bi bi-clock"></i> Pending
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;