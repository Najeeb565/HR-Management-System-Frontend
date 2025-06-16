import { createContext, useState, useEffect } from 'react';

export const CompanyContext = createContext();

const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);

  // Load from localStorage if available (on page refresh)
  useEffect(() => {
    const storedCompany = localStorage.getItem("user");
    if (storedCompany) {
      setCompany(JSON.parse(storedCompany));
    }
  }, []);

  return (
    <CompanyContext.Provider value={{ company, setCompany }}>
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
