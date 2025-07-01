import React, { useState, useEffect } from 'react';

const CompanyDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inactiveEmployees: 0,
    departments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    // console.log('Dashboard stats:', stats);
  }, [stats]);


  const fetchStats = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token"); // ✅ Add this line
      const companyId = user?.companyId;
      console.log("Company ID:", companyId);

      if (!companyId) {
        setError("Company ID missing");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/employees/stats?companyId=${user.companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ Add token here
        }
      });


      const data = await response.json();

      if (data) {
        setStats(data);
      } else {
        setError("No data returned from server");
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ minHeight: '600px' }}>
      {error && (
        <div className="alert alert-warning mb-4">
          {error}
        </div>
      )}
      <h1 className="h3 mb-4">Dashboard Overview</h1>

      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5>Total Employees</h5>
              <h2>{stats.totalEmployees}</h2>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5>Active Employees</h5>
              <h2>{stats.activeEmployees}</h2>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5>Inactive Employees</h5>
              <h2>{stats.inactiveEmployees}</h2>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card text-white bg-info">
            <div className="card-body">
              <h5>Departments</h5>
              <h2>{stats.departments.length}</h2>
            </div>
          </div>
        </div>
      </div>

      <h5 className="mb-3">Department Breakdown</h5>
      {stats.departments.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Department</th>
                <th>Employees</th>
                <th>% of Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.departments.map((dept, i) => (
                <tr key={i}>
                  <td>{dept._id}</td>
                  <td>{dept.count}</td>
                  <td>{((dept.count / stats.totalEmployees) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No department data available.</p>
      )}
    </div>
  );
};

export default CompanyDashboard;