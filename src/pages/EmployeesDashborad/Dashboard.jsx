import React, { useEffect, useState } from "react";
import Attendance from "./attendance/AttendancePage";
import AttendanceChart from "./attendance/AttendanceChart";
import axios from "../../axios";

const EmpDashboard = () => {
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get("/attendance/history");
        setAttendanceHistory(data);
      } catch (error) {
        console.error("Failed to fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const chartData = attendanceHistory.map((record) => {
    const [h, m] = (record.totalHours || "0:0").split(":");
    return {
      date: record.date.slice(5), // show as MM-DD
      hours: parseFloat(h) + parseFloat(m) / 60,
      originalDate: record.date // keep full date for tooltips
    };
  });

  return (
    <div className="container-fluid px-4 py-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Employee Dashboard</h2>
        <div className="text-muted small">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {/* Attendance Tracker Card */}
          <div className="col-xl-6 col-lg-12">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <Attendance />
              </div>
            </div>
          </div>

          {/* Attendance Chart Card */}
          <div className="col-xl-6 col-lg-12">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <AttendanceChart data={chartData} />
              </div>
            </div>
          </div>

          {/* Additional Dashboard Widgets can be added below */}
          {/* <div className="col-12">
            <OtherDashboardComponent />
          </div> */}
        </div>
      )}
    </div>
  );
};

export default EmpDashboard;