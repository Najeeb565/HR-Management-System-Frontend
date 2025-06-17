import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import PageHeader from './Layout/PageHeader';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, 
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [data, setData] = useState({
    userStats: {
      total: 0,
      active: 0,
      newThisMonth: 0
    },
    companyStats: {
      total: 0,
      active: 0,
      pending: 0,
      blocked: 0
    },
    revenueStats: {
      thisMonth: 0,
      growth: 0
    },
    monthlyData: {
      labels: [],
      users: [],
      revenue: []
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Fetch dashboard data
      const dashboardResponse = await axios.get('http://localhost:5000/api/dashboard');
      const dashboardData = dashboardResponse.data.data;

      // Fetch pending companies
      const pendingCompaniesResponse = await axios.get('http://localhost:5000/api/companies?status=pending');
      const pendingCompaniesCount = pendingCompaniesResponse.data.count;

      // Structure the data to match the state
      setData({
        userStats: {
          total: dashboardData.userStats?.total || 0,
          active: dashboardData.userStats?.active || 0,
          newThisMonth: dashboardData.userStats?.newThisMonth || 0
        },
        companyStats: {
          total: dashboardData.companyStats?.total || 0,
          active: dashboardData.companyStats?.active || 0,
          pending: pendingCompaniesCount || 0,
          blocked: dashboardData.companyStats?.blocked || 0
        },
        revenueStats: {
          thisMonth: dashboardData.revenueStats?.thisMonth || 0,
          growth: dashboardData.revenueStats?.growth || 0
        },
        monthlyData: {
          labels: dashboardData.monthlyData?.labels || [],
          users: dashboardData.monthlyData?.users || [],
          revenue: dashboardData.monthlyData?.revenue || []
        }
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to fetch analytics data');
      setIsLoading(false);
    }
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

  const userChartData = {
    labels: data.monthlyData.labels,
    datasets: [
      {
        label: 'Total Admins',
        data: data.monthlyData.users,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const companyChartData = {
    labels: ['Active', 'Pending', 'Blocked'],
    datasets: [
      {
        data: [
          data.companyStats.active,
          data.companyStats.pending,
          data.companyStats.blocked
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const revenueChartData = {
    labels: data.monthlyData.labels,
    datasets: [
      {
        label: 'Revenue',
        data: data.monthlyData.revenue,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="fade-in">
      <PageHeader title="Analytics Dashboard" />

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-xl-3">
          <div className="card dashboard-card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="card-icon bg-primary-subtle text-primary">
                  <i className="bi bi-people"></i>
                </div>
                <div>
                  <h6 className="card-title text-muted mb-0">Total Admins</h6>
                  <h2 className="mt-2 mb-0">{data.userStats.total}</h2>
                </div>
              </div>
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex align-items-center">
                  <span className="badge bg-success me-2">
                    <i className="bi bi-arrow-up"></i> {data.userStats.newThisMonth}
                  </span>
                  <span className="text-muted small">new this month</span>
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
                  <i className="bi bi-building"></i>
                </div>
                <div>
                  <h6 className="card-title text-muted mb-0">Total Companies</h6>
                  <h2 className="mt-2 mb-0">{data.companyStats.total}</h2>
                </div>
              </div>
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex align-items-center">
                  <span className="me-2">Active:</span>
                  <span className="fw-bold">{data.companyStats.active}</span>
                  <span className="mx-2">|</span>
                  <span className="me-2">Pending:</span>
                  <span className="fw-bold">{data.companyStats.pending}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-xl-3">
          <div className="card dashboard-card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="card-icon bg-info-subtle text-info">
                  <i className="bi bi-graph-up"></i>
                </div>
                <div>
                  <h6 className="card-title text-muted mb-0">Monthly Revenue</h6>
                  <h2 className="mt-2 mb-0">${data.revenueStats.thisMonth}</h2>
                </div>
              </div>
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex align-items-center">
                  <span className="badge bg-success me-2">
                    <i className="bi bi-arrow-up"></i> {data.revenueStats.growth}%
                  </span>
                  <span className="text-muted small">vs last month</span>
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
                  <i className="bi bi-person-check"></i>
                </div>
                <div>
                  <h6 className="card-title text-muted mb-0">Active Admins</h6>
                  <h2 className="mt-2 mb-0">{data.userStats.active}</h2>
                </div>
              </div>
              <div className="mt-3 pt-3 border-top">
                <div className="d-flex align-items-center">
                  <span className="text-muted small">
                    {data.userStats.total > 0
                      ? ((data.userStats.active / data.userStats.total) * 100).toFixed(1)
                      : 0}% of total admins
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card dashboard-card">
            <div className="card-body">
              <h5 className="card-title">Admin Growth</h5>
              <Line data={userChartData} options={{ responsive: true }} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card dashboard-card">
            <div className="card-body">
              <h5 className="card-title">Company Status Distribution</h5>
              <Doughnut data={companyChartData} options={{ responsive: true }} />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card dashboard-card">
            <div className="card-body">
              <h5 className="card-title">Revenue Trend</h5>
              <Bar data={revenueChartData} options={{ responsive: true }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;