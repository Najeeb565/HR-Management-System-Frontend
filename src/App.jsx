import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/landing/landing";
import LoginPage from "./pages/login/login";
import Dashboard from "./SuperAdmin/Dashboard";
import CompanyRegisterForm from "./pages/register/Registrationform";
import SuperAdmin from "./SuperAdmin/Stylelayout";
import Analytics from "./SuperAdmin/Analytics";
import Superadmin from './pages/superadmin/Superadmin';
import RequestSent from './pages/register/RequestSent'; // Assuming this path is correct

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<CompanyRegisterForm />} />
        <Route path="/CompanyRegisterForm" element={<Navigate to="/register" replace />} />

        <Route path="/superadmin/*" element={<SuperAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        <Route path="/superadminlogin" element={<Superadmin />} />
        <Route path="/RequestSent/:companyId" element={<RequestSent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
