import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';

const Companylayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Debug: Log current route to verify navigation
  useEffect(() => {
    console.log('Current route:', location.pathname);
  }, [location.pathname]);

  const menuItems = [
    { path: '/company-dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/company-dashboard/employees', icon: 'bi-people', label: 'All Employees' },
    { path: '/company-dashboard/employees/add', icon: 'bi-person-plus', label: 'Add Employee' }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="container-fluid" style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div 
        className="sidebar" 
        style={{ 
          width: '20%', 
          backgroundColor: '#343a40', 
          color: '#fff', 
          position: 'fixed', 
          height: '100vh', 
          overflowY: 'auto'
        }}
      >
        <div className="p-3">
          <Link to="/" className="brand-logo text-white text-decoration-none">
            <i className="bi bi-building me-2"></i>
            CompanyHub
          </Link>
        </div>

        <nav className="nav flex-column mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              style={{ color: '#fff', padding: '0.5rem 1rem' }}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`${item.icon} me-2`}></i> 
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div 
        className="main-content"
        style={{ 
          width: '80%', 
          marginLeft: '20%', 
          backgroundColor: '#f8f9fa', 
          minHeight: '100vh', 
          padding: '20px'
        }}
      >
        {/* Mobile Header */}
        <div className="d-md-none bg-white p-3 border-bottom">
          <button
            className="btn btn-outline-secondary"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list"></i>
          </button>
          <span className="ms-3 fw-bold">CompanyHub</span>
        </div>

        {/* Page Content */}
        <div>
          <Outlet />
          {/* Show debug text only if no route content is rendered */}
          {!React.Children.count(React.Children.toArray(Outlet).find(child => child)) && (
            <div className="mt-2 text-muted">
              [Debug: Main content area should display route content above]
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-md-none"
          style={{ zIndex: 999 }}
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Companylayout;