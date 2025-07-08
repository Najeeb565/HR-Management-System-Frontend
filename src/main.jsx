import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 import it
import CompanyProvider from './context/CompanyContext'
import EmployeeProvider from './context/EmployeeContext'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(

    <BrowserRouter> {/* ✅ Wrap router here */}
      <CompanyProvider>
        <EmployeeProvider>
          <App />
        </EmployeeProvider>
      </CompanyProvider>
    </BrowserRouter>
)
