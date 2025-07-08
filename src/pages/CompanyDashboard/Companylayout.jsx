import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { CompanyContext } from '../../context/CompanyContext';
import { useParams } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiUserPlus, 
  FiUser, 
  FiCheckSquare, 
  FiCalendar,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const CompanyLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { company } = useContext(CompanyContext);
  const { companySlug } = useParams();

  const menuItems = [
    { 
      path: `/${companySlug}/company-dashboard`, 
      icon: <FiHome size={18} />, 
      label: 'Dashboard' 
    },
    { 
      path: `/${companySlug}/company-dashboard/employees`, 
      icon: <FiUsers size={18} />, 
      label: 'All Employees' 
    },
    { 
      path: `/${companySlug}/company-dashboard/employees/add`, 
      icon: <FiUserPlus size={18} />, 
      label: 'Add Employee' 
    },
    { 
      path: `/${companySlug}/company-dashboard/AdminProfile`, 
      icon: <FiUser size={18} />, 
      label: 'Profile' 
    },
    { 
      path: `/${companySlug}/company-dashboard/taskmanagement`, 
      icon: <FiCheckSquare size={18} />, 
      label: 'Task Management' 
    },
    { 
      path: `/${companySlug}/company-dashboard/leavemangement`, 
      icon: <FiCalendar size={18} />, 
      label: 'Leave Management' 
    },
    { 
      path: '/logout', 
      icon: <FiLogOut size={18} />, 
      label: 'Logout' 
    }
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Style objects
  const styles = {
    appContainer: {
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc'
    },
    desktopSidebar: {
      width: sidebarOpen ? '240px' : '80px',
      backgroundColor: '#ffffff',
      color: '#64748b',
      position: 'fixed',
      height: '100vh',
      overflowY: 'auto',
      transition: 'width 0.3s ease',
      boxShadow: '2px 0 10px rgba(0, 0, 0, 0.05)',
      zIndex: 100
    },
    sidebarHeader: {
      padding: '1.5rem 1rem',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    navLink: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      margin: '0.25rem 0',
      borderRadius: '8px',
      textDecoration: 'none',
      color: isActive ? '#4f46e5' : '#64748b',
      backgroundColor: isActive ? '#eef2ff' : 'transparent',
      transition: 'all 0.2s ease',
      ':hover': {
        backgroundColor: '#f1f5f9'
      }
    }),
    mobileSidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '280px',
      height: '100vh',
      backgroundColor: '#ffffff',
      zIndex: 1000,
      boxShadow: '2px 0 20px rgba(0, 0, 0, 0.1)',
      overflowY: 'auto'
    },
    mainContent: {
      flex: 1,
      marginLeft: '240px',
      transition: 'margin-left 0.3s ease'
    },
    mainContentCollapsed: {
      flex: 1,
      marginLeft: '80px',
      transition: 'margin-left 0.3s ease'
    },
    mobileHeader: {
      display: 'none',
      padding: '1rem',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      position: 'sticky',
      top: 0,
      zIndex: 50
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999
    }
  };

  return (
    <div style={styles.appContainer}>
      {/* Desktop Sidebar */}
      <div
        style={{
          ...styles.desktopSidebar,
          display: window.innerWidth > 768 ? 'block' : 'none'
        }}
      >
        <div style={styles.sidebarHeader}>
          {sidebarOpen ? (
            <Link 
              to={`/${companySlug}/company-dashboard`} 
              style={{ 
                textDecoration: 'none',
                color: '#1e293b',
                fontWeight: '600',
                fontSize: '1.25rem'
              }}
            >
              {company?.name || 'CompanyHub'}
            </Link>
          )
           : (
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem'
            }}>
              {company?.name?.charAt(0) || 'C'}
            </div>
          )}
          
          <button 
            onClick={toggleSidebar}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            {sidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        </div>

        <nav style={{ padding: '1rem 0' }}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={styles.navLink(location.pathname === item.path)}
            >
              <span style={{ 
                marginRight: sidebarOpen ? '12px' : '0',
                color: location.pathname === item.path ? '#4f46e5' : '#64748b'
              }}>
                {item.icon}
              </span>
              {sidebarOpen && (
                <span style={{
                  fontWeight: location.pathname === item.path ? '500' : '400',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div
          style={{
            ...styles.mobileSidebar,
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}
        >
          <div style={styles.sidebarHeader}>
            <Link 
              to={`/${companySlug}/company-dashboard`} 
              style={{ 
                textDecoration: 'none',
                color: '#1e293b',
                fontWeight: '600',
                fontSize: '1.25rem'
              }}
              onClick={() => setMobileSidebarOpen(false)}
            >
              {company?.name || 'CompanyHub'}
            </Link>
            <button 
              onClick={toggleMobileSidebar}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                padding: '0.25rem'
              }}
            >
              <FiX size={24} />
            </button>
          </div>

          <nav style={{ padding: '1rem 0' }}>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={styles.navLink(location.pathname === item.path)}
                onClick={() => setMobileSidebarOpen(false)}
              >
                <span style={{ 
                  marginRight: '12px',
                  color: location.pathname === item.path ? '#4f46e5' : '#64748b'
                }}>
                  {item.icon}
                </span>
                <span style={{
                  fontWeight: location.pathname === item.path ? '500' : '400'
                }}>
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div
        style={sidebarOpen ? styles.mainContent : styles.mainContentCollapsed}
      >
        {/* Mobile Header */}
        <div
          style={{
            ...styles.mobileHeader,
            display: window.innerWidth <= 768 ? 'flex' : 'none'
          }}
        >
          <button
            onClick={toggleMobileSidebar}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer'
            }}
          >
            <FiMenu size={24} />
          </button>
          <div style={{
            fontWeight: '600',
            color: '#1e293b'
          }}>
            {company?.name || 'CompanyHub'}
          </div>
          <div style={{ width: '24px' }}></div>
        </div>

        {/* Page Content */}
        <div style={{ 
          padding: window.innerWidth > 768 ? '2rem' : '1rem'
        }}>
          <Outlet />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && window.innerWidth <= 768 && (
        <div
          style={styles.overlay}
          onClick={toggleMobileSidebar}
        ></div>
      )}
    </div>
  );
};

export default CompanyLayout;