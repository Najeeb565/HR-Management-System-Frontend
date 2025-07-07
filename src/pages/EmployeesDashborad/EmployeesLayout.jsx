import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, Outlet, useParams } from 'react-router-dom';
import { CompanyContext } from '../../context/CompanyContext';
import { EmployeeContext } from '../../context/EmployeeContext';
import axios from '../../axios';

const EmployeesLayout = () => {
  const location = useLocation();
  const { companySlug } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { company } = useContext(CompanyContext);
  const { employee, setEmployee } = useContext(EmployeeContext);

  useEffect(() => {
    if (!employee) {
      const stored = localStorage.getItem('user');
      if (stored && stored !== 'undefined') {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.role === 'employee') {
            setEmployee(parsed);
          }
        } catch (err) {
          console.error("Failed to parse employee:", err);
        }
      }
    }
  }, [employee]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  const menuItems = [
    { path: `/${companySlug}/employees-dashboard`, icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: `/${companySlug}/employees-dashboard/Employeestask`, icon: 'bi-list-task', label: 'Task Management' },
    { path: `/${companySlug}/employees-dashboard/Attendancehistory`, icon: 'bi-calendar-check', label: 'Attendance History' },
    { path: `/${companySlug}/employees-dashboard/LeaveMangement`, icon: 'bi-calendar-plus', label: 'Leave Management' },
    { path: `/${companySlug}/employees-dashboard/profile`, icon: 'bi-person', label: 'Profile' },
    { path: '/logout', icon: 'bi-box-arrow-right', label: 'Logout' }
  ];

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>

      {/* Desktop Sidebar */}
      <div
        className="d-none d-md-flex flex-column text-white"
        style={{
          width: sidebarOpen ? '260px' : '80px', 
          backgroundColor: '#ffffff',
          color: '#64748b',
          position: 'fixed',
          height: '100vh',
          overflowY: 'auto',
          transition: 'width 0.3s ease',
          boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
          zIndex: 100
        }}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          {sidebarOpen ? (
            <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#1e293b' }}>
              {employee?.name || 'Employee'}
            </div>
          ) : (
            <div
              className="d-flex align-items-center justify-content-center rounded"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#4f46e5',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {employee?.name?.charAt(0) || 'E'}
            </div>
          )}

          <button onClick={toggleSidebar} className="btn btn-link text-secondary p-0">
            <i className={`bi bi-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="nav flex-column px-2 py-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="nav-link d-flex align-items-center mb-2"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 15px',
                margin: '4px 0',
                borderRadius: '8px',
                textDecoration: 'none',
                color: location.pathname === item.path ? '#4f46e5' : '#64748b',
                backgroundColor: location.pathname === item.path ? '#eef2ff' : 'transparent',
                fontWeight: location.pathname === item.path ? '500' : '400',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <i className={`${item.icon} ${sidebarOpen ? 'me-3' : 'mx-auto'}`} style={{
                color: location.pathname === item.path ? '#4f46e5' : '#64748b'
              }}></i>
              {sidebarOpen && item.label}
            </Link>

          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: sidebarOpen ? '240px' : '80px',
          transition: 'margin-left 0.3s ease'
        }}
      >
        {/* Mobile Header */}
        <div className="d-md-none bg-white border-bottom p-3 d-flex align-items-center justify-content-between sticky-top" style={{ zIndex: 50 }}>
          <button className="btn btn-outline-secondary" onClick={toggleMobileSidebar}>
            <i className="bi bi-list"></i>
          </button>
          <span className="fw-bold text-dark">{company?.name || 'CompanyHub'}</span>
          <div style={{ width: '24px' }}></div>
        </div>

        {/* Mobile Sidebar */}
        {mobileSidebarOpen && (
          <>
            <div
              className="position-fixed top-0 start-0 h-100 bg-white p-4 shadow"
              style={{
                width: '260px',
                zIndex: 1050,
                overflowY: 'auto'
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="fw-bold text-dark">{employee?.name || 'Employee'}</div>
                <button className="btn btn-link text-secondary p-0" onClick={toggleMobileSidebar}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>

              <nav className="nav flex-column">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link d-flex align-items-center mb-2 ${location.pathname === item.path ? 'bg-primary text-white rounded' : 'text-secondary'}`}
                    onClick={toggleMobileSidebar}
                  >
                    <i className={`${item.icon} me-3`}></i>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Overlay */}
            <div
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
              style={{ zIndex: 1040 }}
              onClick={toggleMobileSidebar}
            />
          </>
        )}

        {/* Page Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeesLayout;
