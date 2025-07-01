import axios from 'axios';
import { useEffect, useState } from 'react';

const AdminLeaveList = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/leaves')
      .then((res) => setLeaves(res.data))
      .catch((err) => console.error(err));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/leaves/${id}/status`, { status });
      const res = await axios.get('http://localhost:5000/api/leaves');
      setLeaves(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Employee Leave Requests</h2>

      <table className="table table-bordered table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Employee Name</th>
            <th>Leave Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {leaves.length > 0 ? (
            leaves.map((leave, index) => (
              <tr key={leave._id}>
                <td>{index + 1}</td>
                <td>{leave.employeeId ? `${leave.employeeId.firstName} ` : 'Unknown'}</td>

                <td>{leave.leaveType}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>{leave.reason}</td>
                <td>
                  <span
                    className={`badge ${
                      leave.status === 'Approved'
                        ? 'bg-success'
                        : leave.status === 'Rejected'
                        ? 'bg-danger'
                        : 'bg-warning text-dark'
                    }`}
                  >
                    {leave.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => updateStatus(leave._id, 'Approved')}
                      disabled={leave.status === 'Approved'}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => updateStatus(leave._id, 'Rejected')}
                      disabled={leave.status === 'Rejected'}
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminLeaveList;
