import React, { useState, useEffect, useContext } from 'react';
import './leave.css';
import axios from '../../axios';
import { EmployeeContext } from '../../context/EmployeeContext';

const Leavemangement = () => {
 const employee = useContext(EmployeeContext);

  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveList, setLeaveList] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // ✅ Fetch all leaves from backend on page load
  useEffect(() => {
    fetchLeaves();
  }, []);

const fetchLeaves = async () => {
  try {
    const res = await axios.get(`/leaves?employeeId=${employee?.employee?._id}`);
    setLeaveList(res.data);

    setShowList(true);
    console.log('Leaves fetched successfully:', res.data);
    
  } catch (err) {
    console.error('Error fetching leaves:', err);
  }
};

   
  // 📤 Axios POST Request
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLeave = {
      leaveType,
      startDate,
      endDate,
      reason,
      employeeId: employee?.employee?._id,

    };

    try {
      await axios.post('/leaves', newLeave);

      // Reset form
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');

      setShowForm(false);
      setShowList(true);

      // Refresh leave list
      fetchLeaves();
    } catch (err) {
      console.error('Error submitting leave:', err);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true);
            setShowList(false);
          }}
        >
          Apply Leave
        </button>
      </div>

      {showForm && (
        <div className="card mx-auto mb-5" style={{ maxWidth: '600px' }}>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">Leave Application</h5>
              <button
                className="btn-close"
                onClick={() => {
                  setShowForm(false);
                  setShowList(false);
                }}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="leaveType" className="form-label">Leave Type</label>
                <select
                  id="leaveType"
                  className="form-select"
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  required
                >
                  <option value="">Select Leave Type</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Urgent Leave">Urgent Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Paternity Leave">Paternity Leave</option>
                  <option value="Bereavement Leave">Bereavement Leave</option>
                  <option value="Compensatory Leave">Compensatory Leave</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Leave Duration</label>
                <div className="d-flex gap-3">
                  <div className="flex-fill">
                    <label htmlFor="startDate" className="form-label">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      className="form-control"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex-fill">
                    <label htmlFor="endDate" className="form-label">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      className="form-control"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="reason" className="form-label">Reason</label>
                <textarea
                  id="reason"
                  className="form-control"
                  placeholder="Enter reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-success">Submit Leave</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showList && (
        <div className="leave-list">
          <h4 className="mb-3">Submitted Leaves</h4>
          {leaveList.length === 0 ? (
            <p>No leave applications submitted yet.</p>
          ) : (
            <div className="list-group">
              {leaveList.map((leave, index) => (
                <div
                  key={index}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleExpand(index)}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{leave.leaveType}</strong>
                    <span>{expandedIndex === index ? '-' : '+'}</span>
                  </div>

                  {expandedIndex === index && (
                    <div className="mt-2">
                      <p><strong>Start Date:</strong> {leave.startDate}</p>
                      <p><strong>End Date:</strong> {leave.endDate}</p>
                      <p><strong>Reason:</strong> {leave.reason}</p>
                     <p><strong>Status:</strong> {leave.status}</p>

                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leavemangement;
