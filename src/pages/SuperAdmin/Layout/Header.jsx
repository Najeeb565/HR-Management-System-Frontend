import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Header = ({ toggleSidebar }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  
  useEffect(() => {
    // Get user info from localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setAdminName(parsed.name || 'Admin');
    }
    
    // Mock notifications - would come from API in production
    setNotifications([
      { id: 1, title: 'New company registered', message: 'Tech Innovators Inc. has registered', time: '2 mins ago', read: false },
      { id: 2, title: 'Company approved', message: 'Digital Solutions has been approved', time: '1 hour ago', read: false },
      { id: 3, title: 'System update', message: 'System will be updated tonight', time: '3 hours ago', read: true },
    ]);
  }, []);
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  
  const markAsRead = (id) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
    toast.success('All notifications marked as read');
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-white shadow-sm">
      <div className="container-fluid">
        <div className="row py-3">
          <div className="col-md-6 d-flex align-items-center">
            <button 
              className="btn btn-link text-dark d-none d-lg-block sidebar-toggle me-3"
              onClick={toggleSidebar}
            >
              <i className="bi bi-list fs-4"></i>
            </button>
            <button
              className="btn btn-link text-dark d-lg-none mobile-menu-toggle me-3"
              onClick={toggleSidebar}
            >
              <i className="bi bi-list fs-4"></i>
            </button>
            <h4 className="mb-0">Super Admin Dashboard</h4>
          </div>
          
          <div className="col-md-6 d-flex align-items-center justify-content-end">
            <div className="position-relative me-3">
              <button 
                className="btn btn-link text-dark position-relative" 
                onClick={toggleNotifications}
              >
                <i className="bi bi-bell fs-5"></i>
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div className="position-absolute end-0 mt-2 py-2 bg-white rounded shadow-lg notification-dropdown" style={{ width: '320px', zIndex: 1000 }}>
                  <div className="d-flex justify-content-between align-items-center px-3 pb-2 border-bottom">
                    <h6 className="mb-0">Notifications</h6>
                    {unreadCount > 0 && (
                      <button 
                        className="btn btn-link text-primary p-0 small"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`px-3 py-2 border-bottom notification-item ${notification.read ? '' : 'bg-light'}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="d-flex justify-content-between">
                            <p className="mb-0 fw-bold small">{notification.title}</p>
                            <small className="text-muted">{notification.time}</small>
                          </div>
                          <p className="mb-0 small">{notification.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center py-3">No notifications</p>
                    )}
                  </div>
                  
                  <div className="text-center pt-2 pb-1">
                    <Link to="/notifications" className="text-primary small">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <div className="dropdown">
              <button className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center" type="button" id="userMenu" data-bs-toggle="dropdown" aria-expanded="false">
                <div className="me-2 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
                  {adminName.charAt(0)}
                </div>
                <span className="d-none d-md-inline">{adminName}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userMenu">
                <li><a className="dropdown-item" href="#"><i className="bi bi-person me-2"></i> Profile</a></li>
                <li><a className="dropdown-item" href="#"><i className="bi bi-gear me-2"></i> Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userInfo');
                    window.location.href = '/login';
                  }}>
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;