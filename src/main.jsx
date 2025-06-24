import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CompanyProvider from './context/CompanyContext'
import EmployeeProvider from './context/EmployeeContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EmployeeProvider>
      <CompanyProvider>
        <App />
      </CompanyProvider>
    </EmployeeProvider>

  </StrictMode>,
)
