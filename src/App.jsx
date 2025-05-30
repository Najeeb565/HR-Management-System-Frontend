import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/landing/landing";
import LoginPage from "./pages/login/login";
import Dashboard from "./pages/landing/dashboard/dashboard";
import CompanyRegisterForm from "./pages/register/Registrationform";
import RequestSent from "./pages/register/requestsentpage/requestsentpage";
import SuperAdminLogin from "./pages/superadminlogin/superAdminLogin";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/CompanyRegisterForm" element={<CompanyRegisterForm />} />
        <Route path="/superadminlogin" element={<SuperAdminLogin />} />
        <Route path="/RequestSent/:companyId" element={<RequestSent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
