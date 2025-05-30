// src/pages/superadmin/CompanyRequests.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompanyRequests = () => {
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = async () => {
    const res = await axios.get('http://localhost:5000/api/superadmin/pending-companies');
    setCompanies(res.data);
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/superadmin/companies/${id}/status`, { status });
    fetchCompanies(); // refresh list
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pending Company Requests</h1>
      {companies.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul className="space-y-4">
          {companies.map((company) => (
            <li key={company._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <h2 className="font-semibold">{company.name}</h2>
                <p>{company.email}</p>
              </div>
              <div className="space-x-2">
                <button onClick={() => updateStatus(company._id, 'approved')} className="px-3 py-1 bg-green-600 text-white rounded">
                  Approve
                </button>
                <button onClick={() => updateStatus(company._id, 'rejected')} className="px-3 py-1 bg-red-600 text-white rounded">
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanyRequests;
