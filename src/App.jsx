import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

// Public Pages
import Landing from "./pages/landing/landing";
import Login from "./pages/login/login";
import CompanyRegisterForm from "./pages/register/Registrationform";
import RequestSent from './pages/register/requestsentpage/requestsentpage';
import Superadminlogin from './pages/superadminlogin/superAdminLogin';

// Super Admin
import SuperAdmin from "./pages/SuperAdmin/Stylelayout";
import SuperAdminDashboard from "./pages/SuperAdmin/Dashboard";
import Analytics from "./pages/SuperAdmin/Analytics";
import SuperAdminSetting from './pages/SuperAdmin/SuperAdminSetting';
import CompanyList from './pages/SuperAdmin/companies/CompanyList';
import AdminList from './pages/SuperAdmin/Admin/AdminList';

// Company Dashboard
import Companylayout from "./pages/CompanyDashboard/Companylayout";
import CompanyDashboard from './pages/CompanyDashboard/CompanyDashboard';
import AddEmployee from "./pages/CompanyDashboard/AddEmployee";
import EditEmployee from "./pages/CompanyDashboard/EditEmployee";
import EmployeeList from "./pages/CompanyDashboard/EmployeeList";
import EmployeeProfile from "./pages/CompanyDashboard/EmployeeProfile";
import SetCompanyAdmin from './pages/CompanyDashboard/setadmin/setadmin';
import Taskmanagement from "./pages/CompanyDashboard/taskmanagement";

// Employee Dashboard
import EmployeesLayout from "./pages/EmployeesDashborad/EmployeesLayout";
import EmployeesDashboard from "./pages/EmployeesDashborad/Dashboard";
import TaskManagementemployees from "./pages/EmployeesDashborad/TaskMangement";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CompanyRegisterForm />} />
        <Route path="/CompanyRegisterForm" element={<Navigate to="/register" replace />} />
        <Route path="/RequestSent/:companyId" element={<RequestSent />} />
        <Route path="/company-dashboard/set-admin/:companyId" element={<SetCompanyAdmin />} />
        <Route path="/superadminlogin" element={<Superadminlogin />} />

        {/* Super Admin Routes */}
        <Route path="/superadmin/*" element={<SuperAdmin />}>
          <Route index element={<SuperAdminDashboard />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<SuperAdminSetting />} />
          <Route path="companies" element={<CompanyList />} />
          <Route path="admins" element={<AdminList />} />
        </Route>

        {/* Company Dashboard Routes */}
        <Route path="/:companySlug/company-dashboard" element={<Companylayout />}>
          <Route index element={<CompanyDashboard />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/add" element={<AddEmployee />} />
          <Route path="employees/edit/:id" element={<EditEmployee />} />
          <Route path="employees/profile/:id" element={<EmployeeProfile />} />
          <Route path="taskmanagement" element={<Taskmanagement />} />
        </Route>

        {/* Employees Dashboard Routes */}
        <Route path="/:companySlug/employees-dashboard" element={<EmployeesLayout />}>
          <Route path="employeesdashboard" element={<EmployeesDashboard />} />
          <Route path="taskmanagement" element={<TaskManagementemployees />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
