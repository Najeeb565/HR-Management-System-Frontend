import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 👈 import it
import CompanyProvider from './context/CompanyContext'
import EmployeeProvider from './context/EmployeeContext'
import App from './App.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'


createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    <NotificationProvider>
      <CompanyProvider>
        <EmployeeProvider>
          <App />
        </EmployeeProvider>
      </CompanyProvider>
    </NotificationProvider>
    </BrowserRouter>
)
