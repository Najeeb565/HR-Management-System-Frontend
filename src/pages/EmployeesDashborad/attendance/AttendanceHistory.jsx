import React, { useEffect, useState } from "react";
import axios from "../../../axios";
import { toast } from "react-hot-toast";
import { FiSearch, FiFilter } from "react-icons/fi";

const AttendanceHistory = () => {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [history, searchTerm, statusFilter]);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get("/attendance/history");
      setHistory(data);
    } catch (err) {
      toast.error("Failed to load history");
    }
  };

  const filterRecords = () => {
    let results = history;

    // Apply status filter
    if (statusFilter !== "all") {
      results = results.filter(record => 
        statusFilter === "present" ? record.status === "Present" :
        statusFilter === "absent" ? record.status !== "Present" :
        statusFilter === "late" ? record.clockIn > "23:50" : true
      );
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(record => 
        record.date.toLowerCase().includes(term) ||
        (record.clockIn && record.clockIn.toLowerCase().includes(term)) ||
        (record.clockOut && record.clockOut.toLowerCase().includes(term)) ||
        record.status.toLowerCase().includes(term)
      );
    }

    setFilteredHistory(results);
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="card-title mb-0">Attendance History</h5>
          <div className="d-flex">
            <div className="input-group me-3" style={{ width: "250px" }}>
              <span className="input-group-text bg-white">
                <FiSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                id="filterDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FiFilter className="me-1" />
                {statusFilter === "all" ? "All" : 
                 statusFilter === "present" ? "Present" :
                 statusFilter === "absent" ? "Absent" : "Late Arrivals"}
              </button>
              <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => setStatusFilter("all")}
                  >
                    All Records
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => setStatusFilter("present")}
                  >
                    Present Only
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => setStatusFilter("absent")}
                  >
                    Absent Only
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item" 
                    onClick={() => setStatusFilter("late")}
                  >
                    Late Arrivals
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((record, idx) => (
                <tr key={idx}>
                  <td>{record.date}</td>
                  <td>{record.clockIn || "-"}</td>
                  <td>{record.clockOut || "-"}</td>
                  <td>{record.totalHours || "-"}</td>
                  <td>
                    <span 
                      className={`badge rounded-pill bg-${
                        record.status === "Present" ? "success" : 
                        record.clockIn > "09:30" ? "warning text-dark" : "danger"
                      }`}
                    >
                      {record.status === "Present" && record.clockIn > "09:30" ? "Late" : record.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;