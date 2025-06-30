import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../../axios';

const RequestSent = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/companies/${companyId}/status`);
        setStatus(response.data.status);
      } catch (error) {
        console.error("Error checking status:", error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, [companyId]);

  const goToDashboard = () => {
   navigate(`/company-dashboard/set-admin/${companyId}`);
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="bg-white p-5 rounded shadow text-center" style={{ maxWidth: '500px' }}>
        {status === "pending" && (
          <>
            <h2 className="text-warning mb-3">Request Pending</h2>
            <p className="text-secondary mb-1">
              Your company registration request has been sent to the SuperAdmin.
            </p>
            <p className="text-muted mb-4">
              Please wait for final approval. You’ll receive an email once it’s approved.
            </p>
            <div className="text-warning small">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
              Checking status every 10 seconds...
            </div>
          </>
        )}

        {status === "approved" && (
          <>
            <h2 className="text-success mb-3">Company Approved!</h2>
            <p className="text-secondary mb-4">
              Congratulations! Your company has been approved. You can now access your dashboard.
            </p>
            <button onClick={goToDashboard} className="btn-secondary btn-outline btn ">
              Go to Dashboard
            </button>
          </>
        )}

        {status === "rejected" && (
          <>
            <h2 className="text-danger mb-3">Request Rejected</h2>
            <p className="text-secondary">
              Sorry, your company request has been rejected. Please contact support for more details.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestSent;
 