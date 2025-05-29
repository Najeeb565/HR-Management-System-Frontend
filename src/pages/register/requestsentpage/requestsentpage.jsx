// src/pages/company/RequestSent.jsx
import React from 'react';

const RequestSent = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Request Sent!</h2>
        <p className="text-gray-700">
          Your company registration request has been sent to the SuperAdmin.
          <br />
          Please wait for final approval. You will receive a confirmation email once approved.
        </p>
      </div>
    </div>
  );
};

export default RequestSent;
