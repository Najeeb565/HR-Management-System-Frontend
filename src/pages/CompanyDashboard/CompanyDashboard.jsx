// CompanyDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { CompanyContext } from "../../context/CompanyContext";
import ProfileCard from './profilepage/components/proflecard';
import { FiUsers, FiUserCheck, FiUserX, FiLayers } from 'react-icons/fi';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import GlobalChatBox from "../../components/chat/globalchat";
import axios from '../../axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const CompanyDashboard = () => {
  const { company } = useContext(CompanyContext);         
  const [showCard, setShowCard] = useState(false);
  const [birthdays, setBirthdays] = useState([]);
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
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    try {
      const res = await axios.get("/birthdays/upcoming");
      const all = [...res.data.employees, ...res.data.admins];
      setBirthdays(all);
    } catch (error) {
      console.error("Error fetching birthdays:", error);
    }
  };

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

  const departmentChartData = {
    labels: stats.departments.map(dept => dept._id),
    datasets: [
      {
        data: stats.departments.map(dept => dept.count),
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
          <h1>Dashboard Overview</h1>
          <p>Welcome back, {company?.name || "Admin"}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>{new Date().toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
          })}</div>
          <img
            src={company?.profilePicture || "/default-avatar.png"}
            alt="Profile"
            onClick={() => setShowCard(!showCard)}
            style={{
              width: 40, height: 40, borderRadius: '50%', cursor: 'pointer',
              objectFit: 'cover', border: '2px solid #e2e8f0'
            }}
          />
          {showCard && <ProfileCard onClose={() => setShowCard(false)} />}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard title="Total Employees" value={stats.totalEmployees} icon={<FiUsers />} color="#4e73df" trend="up" />
        <StatCard title="Active Employees" value={stats.activeEmployees} icon={<FiUserCheck />} color="#1cc88a" trend="up" />
        <StatCard title="Inactive Employees" value={stats.inactiveEmployees} icon={<FiUserX />} color="#e74a3b" trend="down" />
        <StatCard title="Departments" value={stats.departments.length} icon={<FiLayers />} color="#f6c23e" trend="neutral" />
      </div>

      {/* Department Breakdown and Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem' }}>
          <h3>Department Breakdown</h3>
          {stats.departments.length > 0 ? (
            <div style={{ height: '300px' }}>
              <Doughnut data={departmentChartData} options={departmentChartOptions} />
            </div>
          ) : (
            <p>No department data</p>
          )}
        </div>

        <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem' }}>
          <h3>Department Details</h3>
          {stats.departments.length > 0 ? (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.departments.map((dept, idx) => (
                  <tr key={idx}>
                    <td>{dept._id}</td>
                    <td>{dept.count}</td>
                    <td>{((dept.count / stats.totalEmployees) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p>No department data</p>}
        </div>
      </div>

      {/* Global Chat + Birthdays */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Global Chat */}
        <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem' }}>
          <h3>💬 Global Chat</h3>
          <GlobalChatBox />
        </div>

        {/* Birthdays beside Chat */}
        <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem' }}>
          <h3>🎂 Upcoming Birthdays</h3>
          {birthdays.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {birthdays.map((person) => (
                <li key={person._id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <img src={person.profilePicture || "/default-avatar.png"} alt={person.name} style={{
                    width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover'
                  }} />
                  <div>
                    <strong>{person.name}</strong>
                    <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                      {new Date(person.birthday).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p>No upcoming birthdays</p>}
        </div>
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
      <div style={{ marginTop: '0.75rem', color: trendColors[trend], fontSize: '0.875rem' }}>
        {trend === 'up' ? '↑ Increased' : trend === 'down' ? '↓ Decreased' : '→ No change'} from last month
      </div>
    </div>
  );
};

export default CompanyDashboard;
