import { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const EmployeeContext = createContext();

const EmployeeProvider = ({ children }) => {
  const [employee, setEmployee] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const storedEmployee = localStorage.getItem("user");

    if (storedEmployee && storedEmployee !== "undefined") {
      try {
        const parsedEmployee = JSON.parse(storedEmployee);
        setEmployee(parsedEmployee);
        setEmployeeId(parsedEmployee.employeeId || parsedEmployee.id || null);
      } catch (error) {
        console.error("❌ Failed to parse employee from localStorage:", error);
        setEmployee(null);
        setEmployeeId(null);
      }
    } else {
      setEmployee(null);
      setEmployeeId(null);
    }
  }, [location]);

  return (
    <EmployeeContext.Provider value={{ employee, setEmployee, employeeId }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeProvider;