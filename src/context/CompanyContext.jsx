// // CompanyProvider.jsx
// import { createContext, useState, useEffect } from 'react';

// export const CompanyContext = createContext();

// // const CompanyProvider = ({ children }) => {
// //   const [company, setCompany] = useState(null);
// //   const [companyId, setCompanyId] = useState(null)

// // useEffect(() => {
// //   const storedCompany = localStorage.getItem("user");
// //   if (storedCompany !== "undefined") {
// //     const parsedCompany = JSON.parse(storedCompany);
// //     setCompany(parsedCompany);
// //     setCompanyId(parsedCompany.companyId); 
// //   }
// // }, []);






// //   return (
// //     <CompanyContext.Provider value={{ company, setCompany, companyId }}>
// //       {children}
// //     </CompanyContext.Provider>
// //   );
// // };

// // export default CompanyProvider;





// useEffect(() => {
//   const storedCompany = localStorage.getItem("user");

//   try {
//     if (storedCompany) {
//       const parsedCompany = JSON.parse(storedCompany);

//       if (parsedCompany && parsedCompany.companyId) {
//         setCompany(parsedCompany);
//         setCompanyId(parsedCompany.companyId);
//       } else {
//         console.warn("Invalid company object in localStorage:", parsedCompany);
//         setCompany(null);
//         setCompanyId(null);
//       }
//     }
//   } catch (error) {
//     console.error("Error parsing stored company:", error);
//     setCompany(null);
//     setCompanyId(null);
//   }
// }, []);




// CompanyProvider.jsx
import { createContext, useState, useEffect } from 'react';

export const CompanyContext = createContext();

const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(null);
  const [companyId, setCompanyId] = useState(null);

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
  }, []);

  return (
    <CompanyContext.Provider value={{ company, setCompany, companyId }}>
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;

