import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="d-flex">
      <Sidebar collapsed={sidebarCollapsed} />
      
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="container-fluid py-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;