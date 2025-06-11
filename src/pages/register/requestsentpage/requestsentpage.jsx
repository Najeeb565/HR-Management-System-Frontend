import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    // Optional: keep checking every 10 seconds
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, [companyId]);

  const goToDashboard = () => {
    navigate('/company-dashboard'); // update with your actual dashboard route
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Request Sent!</h2>
        <p className="text-gray-700 mb-6">
          Your company registration request has been sent to the SuperAdmin.
          <br />
          Please wait for final approval. You will receive an email once approved.
        </p>

        {status === "approved" && (
          <button
            onClick={goToDashboard}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        )}

        {status === "pending" && (
          <p className="text-yellow-500 mt-2">Waiting for approval...</p>
        )}
      </div>
    </div>
  );
};

export default RequestSent;
 