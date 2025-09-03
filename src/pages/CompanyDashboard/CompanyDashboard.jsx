// CompanyDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { CompanyContext } from "../../context/CompanyContext";
import ProfileCard from './profilepage/components/proflecard';
import { FiUsers, FiUserCheck, FiUserX, FiLayers } from 'react-icons/fi';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import GlobalChatBox from "../../components/chat/globalchat";
import UpcomingBirthdaysCard from "../../components/birthdaytracker/birthdayTracker";
import axios from '../../axios';
import NotificationBell from '../../components/notification/notification';
import AIChatbox from "../../components/aIchatbox/AIChatbox";


ChartJS.register(ArcElement, Tooltip, Legend);

const CompanyDashboard = () => {
  const { company } = useContext(CompanyContext);
  const [showCard, setShowCard] = useState(false);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const admin = JSON.parse(localStorage.getItem("user"));
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

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const res = await axios.get("/birthdays/upcoming");
        console.log("✅ Birthday API HIT");
        console.log("📦 Birthday API Response", res.data);

        const employees = Array.isArray(res.data.employees) ? res.data.employees : [];

        const all = [...employees];
        console.log("🎂 Combined Birthday List:", all);

        setUpcomingBirthdays(all);
      } catch (error) {
        console.error("❌ Error fetching upcoming birthdays:", error);
      }
    };

    fetchBirthdays();
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

      const response = await fetch(`http://localhost:5000/api/employees/stats?companyId=${companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data) {
        setStats({
          totalEmployees: data.totalEmployees || 0,
          activeEmployees: data.activeEmployees || 0,
          inactiveEmployees: data.inactiveEmployees || 0,
          departments: Array.isArray(data.departments) ? data.departments : []
        });
      }
      else {
        setError("No data returned from server");
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const departmentChartData = {
    labels: stats?.departments?.map(dept => dept._id) || [],
    datasets: [
      {
        data: stats?.departments?.map(dept => dept.count) || [],
        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'],
        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a', '#be2617', '#6c6e7e'],
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
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
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

        <div className="d-flex flex-column align-items-end position-relative" style={{ gap: '0.25rem' }}>

          {/* 🔔 Bell and 👤 Profile side by side */}
          <div className="d-flex align-items-center" style={{ gap: '1rem' }}>
            <NotificationBell userId={admin._id} token={localStorage.getItem("token")} />

            <img
              src={
                company?.profilePicture?.startsWith("http")
                  ? company.profilePicture
                  : company?.profilePicture
                    ? `http://localhost:5000/uploads/${company.profilePicture}`
                    : "/default-avatar.png"
              }
              alt="Profile"
              className="rounded-circle border shadow-sm"
              style={{
                width: "48px",
                height: "48px",
                objectFit: "cover",
                cursor: "pointer",
              }}
              onClick={() => setShowCard(!showCard)}
            />
          </div>

          {/* 👇 Dropdown */}
          {showCard && (
            <div
              className="position-absolute"
              style={{
                top: "55px",
                right: 0,
                zIndex: 1050,
              }}
            >
              <ProfileCard onClose={() => setShowCard(false)} />
            </div>
          )}

          {/* 📅 Date below bell/profile */}
          <div className="text-muted small">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
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
          value={stats?.departments?.length || 0}
          color="#f6c23e"
          trend="neutral"
        />
      </div>

      {/* Department Breakdown and Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem' }}>
          <h3>Department Breakdown</h3>
          {stats?.departments?.length > 0 ? (
            <div style={{ height: '300px' }}>
              <Doughnut data={departmentChartData} options={departmentChartOptions} />
            </div>
          ) : (
            <p>No department data</p>
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

      {/* Global Chat + Birthdays */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
        }}
      >
        {/* 💬 Global Chat */}
        <div>
          <GlobalChatBox />
        </div>

        {/* 🎉 Upcoming Birthdays */}
        <div>
          <UpcomingBirthdaysCard upcomingBirthdays={upcomingBirthdays} />
        </div>
        <AIChatbox />

      </div>


    </div>
  );
};

const StatCard = ({ title, value, icon, color, trend }) => {
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
      borderLeft: `4px solid ${color}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>{title}</p>
          <h2 style={{ margin: 0 }}>{value}</h2>
        </div>
        <div style={{
          width: '40px', height: '40px', background: `${color}20`, color: color,
          borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center'
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
