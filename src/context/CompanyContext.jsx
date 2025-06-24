// CompanyProvider.jsx
import { createContext, useState, useEffect } from 'react';

export const CompanyContext = createContext();

const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [companyId, setCompanyId] = useState(null)

useEffect(() => {
  const storedCompany = localStorage.getItem("user");
  if (storedCompany) {
    const parsedCompany = JSON.parse(storedCompany);
    setCompany(parsedCompany);
    setCompanyId(parsedCompany.companyId); 
  }
}, []);






  return (
    <CompanyContext.Provider value={{ company, setCompany, companyId }}>
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
