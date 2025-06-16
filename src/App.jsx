import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Landing from "./pages/landing/landing";
import Login from "./pages/login/login";
import Dashboard from "./pages/SuperAdmin/Dashboard";
import CompanyRegisterForm from "./pages/register/Registrationform";
import SuperAdmin from "./pages/SuperAdmin/Stylelayout";
import Analytics from "./pages/SuperAdmin/Analytics";
import Superadminlogin from './pages/superadminlogin/superAdminLogin';
import RequestSent from './pages/register/requestsentpage/requestsentpage';
import SuperAdminSetting from './pages/SuperAdmin/SuperAdminSetting';
import CompanyList from './pages/SuperAdmin/companies/CompanyList';
import AdminList from './pages/SuperAdmin/Admin/AdminList';
import SetCompanyAdmin from './pages/CompanyDashboard/setadmin/setadmin';
import CompanyDashboard from './pages/CompanyDashboard/CompanyDashboard';
import AddEmployee from "./pages/CompanyDashboard/AddEmployee";
import EditEmployee from "./pages/CompanyDashboard/EditEmployee";
import EmployeeList from "./pages/CompanyDashboard/EmployeeList";
import EmployeeProfile from "./pages/CompanyDashboard/EmployeeProfile";
import Companylayout from "./pages/CompanyDashboard/Companylayout";
function App() {
  return (

    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CompanyRegisterForm />} />
        <Route path="/CompanyRegisterForm" element={<Navigate to="/register" replace />} />
        <Route path="/RequestSent/:companyId" element={<RequestSent />} />
        <Route path="/company-dashboard/set-admin/:companyId" element={<SetCompanyAdmin />} />

        {/* Super Admin Login */}
        <Route path="/superadminlogin" element={<Superadminlogin />} />

        {/* Super Admin Dashboard Layout with Nested Routes */}
        <Route path="/superadmin/*" element={<SuperAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<SuperAdminSetting />} />
          <Route path="companies" element={<CompanyList />} />
          <Route path="admins" element={<AdminList />} />
        </Route>

        {/* Company Dashboard Routes with Layout */}
        <Route path="/:companySlug/company-dashboard" element={<Companylayout />}>
          <Route index element={<CompanyDashboard />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/add" element={<AddEmployee />} />
          <Route path="employees/edit/:id" element={<EditEmployee />} />
          <Route path="employees/profile/:id" element={<EmployeeProfile />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      


      </Routes>
    </BrowserRouter>
  );
}

export default App;