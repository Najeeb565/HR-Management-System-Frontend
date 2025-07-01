import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ Import here

// Lazy Imports
const Landing = lazy(() => import("./pages/landing/landing"));
const Login = lazy(() => import("./pages/login/login"));
const Dashboard = lazy(() => import("./pages/SuperAdmin/Dashboard"));
const CompanyRegisterForm = lazy(() => import("./pages/register/Registrationform"));
const SuperAdmin = lazy(() => import("./pages/SuperAdmin/Stylelayout"));
const Analytics = lazy(() => import("./pages/SuperAdmin/Analytics"));
const Superadminlogin = lazy(() => import('./pages/superadminlogin/superAdminLogin'));
const RequestSent = lazy(() => import('./pages/register/requestsentpage/requestsentpage'));
const SuperAdminSetting = lazy(() => import('./pages/SuperAdmin/SuperAdminSetting'));
const CompanyList = lazy(() => import('./pages/SuperAdmin/companies/CompanyList'));
const AdminList = lazy(() => import('./pages/SuperAdmin/Admin/AdminList'));
const SetCompanyAdmin = lazy(() => import('./pages/CompanyDashboard/setadmin/setadmin'));
const CompanyDashboard = lazy(() => import('./pages/CompanyDashboard/CompanyDashboard'));
const AddEmployee = lazy(() => import("./pages/CompanyDashboard/AddEmployee"));
const EditEmployee = lazy(() => import("./pages/CompanyDashboard/EditEmployee"));
const EmployeeList = lazy(() => import("./pages/CompanyDashboard/EmployeeList"));
const EmployeeProfile = lazy(() => import("./pages/CompanyDashboard/EmployeeProfile"));
const Companylayout = lazy(() => import("./pages/CompanyDashboard/Companylayout"));
const Taskmanagement = lazy(() => import("./pages/CompanyDashboard/taskmanagement"));
import AdminLeaveList from './pages/CompanyDashboard/adminleave';
const Adminprofile = lazy(() => import('./pages/CompanyDashboard/profilepage/profilepage'));
const Employeeslayout = lazy(() => import("./pages/EmployeesDashborad/EmployeesLayout"));
const Employeestask = lazy(() => import("./pages/EmployeesDashborad/employeestask"));
const EmployeeDashboard = lazy(() => import("./pages/EmployeesDashborad/Dashboard"));
const Logout = lazy(() => import("./components/logout"));
import Leavemangement from './pages/EmployeesDashborad/leavemangement';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<div style={{ textAlign: "center", paddingTop: "50px" }}>Loading...</div>}>
        <Routes>

          {/* Public Pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<CompanyRegisterForm />} />
          <Route path="/CompanyRegisterForm" element={<Navigate to="/register" replace />} />
          <Route path="/RequestSent/:companyId" element={<RequestSent />} />
          <Route path="/company-dashboard/set-admin/:companyId" element={<SetCompanyAdmin />} />
          <Route path="/logout" element={<Logout />} />

          {/* Super Admin Login */}
          <Route path="/superadminlogin" element={<Superadminlogin />} />

          {/* Super Admin Dashboard - Protected */}
          <Route
            path="/superadmin/*"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <SuperAdmin />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<SuperAdminSetting />} />
            <Route path="companies" element={<CompanyList />} />
            <Route path="admins" element={<AdminList />} />
          </Route>

          {/* Company Dashboard - Protected (Admin Only) */}
          <Route
            path="/:companySlug/company-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Companylayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CompanyDashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="employees/add" element={<AddEmployee />} />
            <Route path="employees/edit/:id" element={<EditEmployee />} />
            <Route path="employees/profile/:id" element={<EmployeeProfile />} />
            <Route path="taskmanagement" element={<Taskmanagement />} />
            <Route path="leavemangement" element={<AdminLeaveList />} />
            <Route path="AdminProfile" element={<Adminprofile />} />
          </Route>

          {/* Employee Dashboard - Protected */}
          <Route
            path="/:companySlug/employees-dashboard"
            element={
              <ProtectedRoute allowedRoles={["employee"]}>
                <Employeeslayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<EmployeeDashboard />} />
            <Route path="employeestask" element={<Employeestask />} />
            <Route path="leavemangement" element={<Leavemangement />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Suspense>
    </>
  );
}

export default App;
