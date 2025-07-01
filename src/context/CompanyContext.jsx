import { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const CompanyContext = createContext();

const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedCompany = localStorage.getItem("user");

    if (storedCompany && storedCompany !== "undefined") {
      try {
        const parsedCompany = JSON.parse(storedCompany);
        setCompany(parsedCompany);
        setCompanyId(parsedCompany.companyId || null);
      } catch (error) {
        console.error("❌ Failed to parse company from localStorage:", error);
        setCompany(null);
        setCompanyId(null);
      }
    } else {
      setCompany(null);
      setCompanyId(null);
    }
  }, [location]);

  return (
    <CompanyContext.Provider value={{ company, setCompany, companyId }}>
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;

