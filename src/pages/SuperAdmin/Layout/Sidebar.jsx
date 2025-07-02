import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin User');
  
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setAdminName(parsed.name || 'Admin User');
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('superadmin');
    navigate('/superadminlogin');
  };
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="d-flex align-items-center justify-content-between p-3 border-bottom border-secondary">
        <div className="d-flex align-items-center">
          <i className="bi bi-grid-3x3-gap-fill text-light fs-4 me-2"></i>
          <h5 className="text-light m-0 sidebar-header-text">Super Admin</h5>
        </div>
      </div>


    {/* asdfghj */}
      
      <div className="mt-4">
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link 
              to="/superadmin/dashboard" 
              className={`nav-link ${location.pathname.includes('/dashboard') ? 'active' : ''}`}
            >
              <i className="bi bi-speedometer2"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              to="/superadmin/companies" 
              className={`nav-link ${location.pathname.includes('/companies') ? 'active' : ''}`}
            >
              <i className="bi bi-building"></i>
              <span>Companies</span>
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              to="/superadmin/admins" 
              className={`nav-link ${location.pathname.includes('/admins') ? 'active' : ''}`}
            >
              <i className="bi bi-people"></i>
              <span>Admins</span>
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              to="/superadmin/analytics" 
              className={`nav-link ${location.pathname.includes('/analytics') ? 'active' : ''}`}
            >
              <i className="bi bi-bar-chart"></i>
              <span>Analytics</span>
            </Link>
          </li>
          
          <li className="nav-item">
            <Link 
              to="/superadmin/settings" 
              className={`nav-link ${location.pathname.includes('/settings') ? 'active' : ''}`}
            >
              <i className="bi bi-gear"></i>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="profile-section mt-auto">
        <div className="profile-avatar">
          {getInitials(adminName)}
        </div>
        <div className="text-white sidebar-header-text">{adminName}</div>
        <div className="ms-auto">
          <button 
            onClick={handleLogout}
            className="btn btn-link text-light p-0"
            title="Logout"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
