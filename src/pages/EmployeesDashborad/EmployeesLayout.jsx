import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, Outlet, useParams } from 'react-router-dom';
import { CompanyContext } from '../../context/CompanyContext';
import { EmployeeContext } from '../../context/EmployeeContext';

const EmployeesLayout = () => {
  const location = useLocation();
  const { companySlug } = useParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { company } = useContext(CompanyContext);
  const { employee } = useContext(EmployeeContext);
  // console.log("EMPLOYEE CONTEXT:", employee);


  useEffect(() => {
    // console.log('Current route:', location.pathname);
  }, [location.pathname]);

  const menuItems = [
    { path: `/${companySlug}/employees-dashboard`, icon: 'bi-speedometer2', label: 'Employees Dashboard' },
    { path: `/${companySlug}/employees-dashboard/Employeestask`, icon: 'bi-person-plus', label: 'Task Management' },
    { path: `/${companySlug}/employees-dashboard/Attendancehistory`, icon: 'bi-person-plus', label: 'Attendance History' },
{ path: '/logout', icon: 'bi-box-arrow-right', label: 'Logout' }
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div
        className="d-none d-md-flex flex-column p-3 text-white"
        style={{
          width: '267px',
          backgroundColor: '#2c3e50',
          position: 'fixed',
          height: '100vh'
        }}
      >
        <h5 className="text-white mb-4">
          Welcome, <br />
          <span>{employee?.name || "Employee"}</span>
        </h5>

        <nav className="nav flex-column">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link d-flex align-items-center mb-2 ${
                location.pathname === item.path ? 'bg-secondary text-white rounded' : 'text-white'
              }`}
              style={{ padding: '10px 15px' }}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`${item.icon} me-2`}></i>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: '250px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Mobile top nav */}
        <div className="d-md-none bg-dark text-white p-3 d-flex align-items-center justify-content-between">
          <button className="btn btn-outline-light" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>
          <span className="fw-bold">CompanyHub</span>
        </div>

        {/* Sidebar Overlay for Mobile */}
        {sidebarOpen && (
          <>
            <div
              className="position-fixed top-0 start-0 bg-dark text-white p-4"
              style={{
                width: '250px',
                height: '100vh',
                zIndex: 1050
              }}
            >
              <h5 className="mb-4">Welcome, <br />{company?.name || 'Company'}</h5>
              <nav className="nav flex-column">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`nav-link d-flex align-items-center mb-2 ${
                      location.pathname === item.path ? 'bg-secondary text-white rounded' : 'text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <i className={`${item.icon} me-2`}></i>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Overlay background */}
            <div
              className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50"
              style={{ zIndex: 1040 }}
              onClick={() => setSidebarOpen(false)}
            />
          </>
        )}

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeesLayout;
