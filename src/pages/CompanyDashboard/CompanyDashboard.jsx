import React, { useState, useEffect, useContext } from 'react';
import { CompanyContext } from "../../context/CompanyContext";
import ProfileCard from './profilepage/components/proflecard';
import { FiUsers, FiUserCheck, FiUserX, FiLayers, FiChevronRight } from 'react-icons/fi';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import GlobalChatBox from "../../components/chat/globalchat";
ChartJS.register(ArcElement, Tooltip, Legend);

const CompanyDashboard = () => {
  const { company } = useContext(CompanyContext);         
  const [showCard, setShowCard] = useState(false);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    departments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      const companyId = user?.companyId;

      if (!companyId) {
        setError("Company ID missing");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/employees/stats?companyId=${user.companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data) {
        setStats(data);
      } else {
        setError("No data returned from server");
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for department chart
  const departmentChartData = {
    labels: stats.departments.map(dept => dept._id),
    datasets: [
      {
        data: stats.departments.map(dept => dept.count),
        backgroundColor: [
          '#4e73df',
          '#1cc88a',
          '#36b9cc',
          '#f6c23e',
          '#e74a3b',
          '#858796',
          '#5a5c69'
        ],
        hoverBackgroundColor: [
          '#2e59d9',
          '#17a673',
          '#2c9faf',
          '#dda20a',
          '#be2617',
          '#6c6e7e',
          '#3a3c4a'
        ],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }
    ]
  };

  const departmentChartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh', padding: '2rem' }}>
      {/* Header */}
      <div className="dashboard-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '1.75rem',
            fontWeight: '600',
            color: '#2d3748',
            margin: 0,
          }}>Dashboard Overview</h1>
          <p style={{
            color: '#718096',
            margin: '0.25rem 0 0',
            fontSize: '0.875rem'
          }}>
            Welcome back, {company?.name || 'Admin'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            color: '#64748b',
            fontSize: '0.875rem',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
          }}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src={company?.profilePicture || "/default-avatar.png"}
              alt="Profile"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                cursor: 'pointer',
                border: '2px solid #e2e8f0'
              }}
              onClick={() => setShowCard(!showCard)}
            />
            {showCard && (
              <div style={{
                position: 'absolute',
                top: '50px',
                right: 0,
                zIndex: 1000,
                width: '300px'
              }}>
                <ProfileCard onClose={() => setShowCard(false)} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard 
          icon={<FiUsers size={24} />}
          title="Total Employees"
          value={stats.totalEmployees}
          color="#4e73df"
          trend="up"
        />
        <StatCard 
          icon={<FiUserCheck size={24} />}
          title="Active Employees"
          value={stats.activeEmployees}
          color="#1cc88a"
          trend="up"
        />
        <StatCard 
          icon={<FiUserX size={24} />}
          title="Inactive Employees"
          value={stats.inactiveEmployees}
          color="#e74a3b"
          trend="down"
        />
        <StatCard 
          icon={<FiLayers size={24} />}
          title="Departments"
          value={stats.departments.length}
          color="#f6c23e"
          trend="neutral"
        />
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Department Breakdown */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#2d3748',
              margin: 0
            }}>Department Breakdown</h3>
            <button style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#4e73df',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              View all <FiChevronRight />
            </button>
          </div>

          {stats.departments.length > 0 ? (
            <div style={{ height: '300px' }}>
              <Doughnut data={departmentChartData} options={departmentChartOptions} />
            </div>
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              color: '#718096'
            }}>
              No department data available
            </div>
          )}
        </div>

        {/* Department Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2d3748',
            margin: '0 0 1.5rem 0'
          }}>Department Details</h3>
          
          {stats.departments.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%',
                borderCollapse: 'collapse'
              }}>
                <thead>
                  <tr style={{ 
                    borderBottom: '1px solid #e2e8f0',
                    textAlign: 'left'
                  }}>
                    <th style={{ 
                      padding: '0.75rem 1rem',
                      color: '#718096',
                      fontWeight: '500',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase'
                    }}>Department</th>
                    <th style={{ 
                      padding: '0.75rem 1rem',
                      color: '#718096',
                      fontWeight: '500',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase'
                    }}>Employees</th>
                    <th style={{ 
                      padding: '0.75rem 1rem',
                      color: '#718096',
                      fontWeight: '500',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase'
                    }}>% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.departments.map((dept, i) => (
                    <tr key={i} style={{ 
                      borderBottom: '1px solid #e2e8f0',
                      ':last-child': {
                        borderBottom: 'none'
                      }
                    }}>
                      <td style={{ 
                        padding: '1rem',
                        color: '#2d3748',
                        fontWeight: '500'
                      }}>{dept._id}</td>
                      <td style={{ 
                        padding: '1rem',
                        color: '#4a5568'
                      }}>{dept.count}</td>
                      <td style={{ 
                        padding: '1rem',
                        color: '#4a5568'
                      }}>{((dept.count / stats.totalEmployees) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
              color: '#718096'
            }}>
              No department data available
            </div>
          )}
        </div>
      </div>

      {/* Global Chat Box */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        marginBottom: '2rem'
      }}>
        <GlobalChatBox />
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, color, trend }) => {
  const trendColors = {
    up: '#10b981',
    down: '#ef4444',
    neutral: '#64748b'
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      borderLeft: `4px solid ${color}`
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div>
          <div style={{
            color: '#64748b',
            fontSize: '0.875rem',
            fontWeight: '500',
            marginBottom: '0.5rem'
          }}>{title}</div>
          <div style={{
            color: '#1e293b',
            fontSize: '1.5rem',
            fontWeight: '700'
          }}>{value}</div>
        </div>
        <div style={{
          backgroundColor: `${color}10`,
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color
        }}>
          {icon}
        </div>
      </div>
      {trend && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '0.75rem',
          fontSize: '0.875rem',
          color: trendColors[trend]
        }}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} 
          <span style={{ marginLeft: '0.25rem' }}>
            {trend === 'up' ? 'Increased' : trend === 'down' ? 'Decreased' : 'No change'} from last month
          </span>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;