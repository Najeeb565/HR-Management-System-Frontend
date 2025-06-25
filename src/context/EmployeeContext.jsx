
import { createContext, useEffect, useState } from "react";

export const EmployeeContext = createContext();

const EmployeeProvider = ({ children }) => {
  const [employee, setEmployee] = useState(null);

useEffect(() => {
  const storedEmployee = localStorage.getItem("employee");
  if (storedEmployee && storedEmployee !== "undefined") {
    try {
      setEmployee(JSON.parse(storedEmployee));
    } catch (error) {
      console.error("Failed to parse stored employee:", error);
      setEmployee(null); 
    }
  }
}, []);


  return (
    <EmployeeContext.Provider value={{ employee, setEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeProvider;
