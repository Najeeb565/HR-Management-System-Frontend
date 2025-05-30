import { Outlet } from 'react-router-dom';
import Header from './Layout/Header';
import Sidebar from './Layout/Sidebar';
import "./Stylelayout.css";

const SuperAdminLayout = () => {
  return (
    <div>
      <Header />
      <div className="handle">
        <Sidebar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLayout;