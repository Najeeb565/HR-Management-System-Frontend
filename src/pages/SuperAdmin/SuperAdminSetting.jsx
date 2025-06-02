import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PageHeader from '../SuperAdmin/Layout/PageHeader';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const SuperAdminSetting = () => {
  const [settings, setSettings] = useState({
    platformName: 'Super Admin Dashboard',
    maxCompaniesPerPage: 10,
    maxEmployeesPerCompany: 100,
    emailNotifications: true,
    maintenanceMode: false,
    globalHolidays: [
      { name: 'New Year', date: '2025-01-01' },
      { name: 'Christmas', date: '2025-12-25' }
    ],
    securitySettings: {
      passwordMinLength: 8,
      requirePasswordReset: 90,
      maxLoginAttempts: 5,
      sessionTimeout: 60
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/settings`);
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch settings');
      console.error('Error fetching settings:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/settings`, settings);
      if (response.data.success) {
        toast.success('Settings updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Error updating settings:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <PageHeader title="Platform Settings" />

      <div className="row">
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            <div className="card dashboard-card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">General Settings</h5>

                <div className="mb-3">
                  <label className="form-label">Platform Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={settings.platformName}
                    onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                  />
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Max Companies Per Page</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.maxCompaniesPerPage}
                      onChange={(e) => setSettings({ ...settings, maxCompaniesPerPage: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Max Employees Per Company</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.maxEmployeesPerCompany}
                      onChange={(e) => setSettings({ ...settings, maxEmployeesPerCompany: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="emailNotifications"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="emailNotifications">
                      Enable Email Notifications
                    </label>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="maintenanceMode">
                      Maintenance Mode
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="card dashboard-card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Security Settings</h5>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Minimum Password Length</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.securitySettings.passwordMinLength}
                      onChange={(e) => setSettings({
                        ...settings,
                        securitySettings: {
                          ...settings.securitySettings,
                          passwordMinLength: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Password Reset Period (days)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.securitySettings.requirePasswordReset}
                      onChange={(e) => setSettings({
                        ...settings,
                        securitySettings: {
                          ...settings.securitySettings,
                          requirePasswordReset: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Max Login Attempts</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.securitySettings.maxLoginAttempts}
                      onChange={(e) => setSettings({
                        ...settings,
                        securitySettings: {
                          ...settings.securitySettings,
                          maxLoginAttempts: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={settings.securitySettings.sessionTimeout}
                      onChange={(e) => setSettings({
                        ...settings,
                        securitySettings: {
                          ...settings.securitySettings,
                          sessionTimeout: parseInt(e.target.value)
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="card dashboard-card mb-4">
              <div className="card-body">
                <h5 className="card-title mb-4">Global Holidays</h5>

                {settings.globalHolidays.map((holiday, index) => (
                  <div key={index} className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        className="form-control"
                        value={holiday.name}
                        onChange={(e) => {
                          const newHolidays = [...settings.globalHolidays];
                          newHolidays[index].name = e.target.value;
                          setSettings({ ...settings, globalHolidays: newHolidays });
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="date"
                        className="form-control"
                        value={holiday.date}
                        onChange={(e) => {
                          const newHolidays = [...settings.globalHolidays];
                          newHolidays[index].date = e.target.value;
                          setSettings({ ...settings, globalHolidays: newHolidays });
                        }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => setSettings({
                    ...settings,
                    globalHolidays: [...settings.globalHolidays, { name: '', date: '' }]
                  })}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Holiday
                </button>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={() => fetchSettings()}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="col-lg-4">
          <div className="card dashboard-card">
            <div className="card-body">
              <h5 className="card-title mb-4">Settings Information</h5>
              
              <div className="alert alert-info">
                <h6 className="alert-heading">About Platform Settings</h6>
                <p className="mb-0">
                  These settings control various aspects of the platform's functionality.
                  Changes made here will affect all users and companies in the system.
                </p>
              </div>

              <div className="mb-4">
                <h6>General Settings</h6>
                <p className="text-muted small">
                  Basic platform configuration including name, pagination, and notification preferences.
                </p>
              </div>

              <div className="mb-4">
                <h6>Security Settings</h6>
                <p className="text-muted small">
                  Configure password requirements, session timeouts, and other security-related settings.
                </p>
              </div>

              <div>
                <h6>Global Holidays</h6>
                <p className="text-muted small">
                  Set up holidays that apply to all companies in the system. These dates will be used
                  for attendance and leave calculations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSetting;