import React, { useEffect, useState } from "react";
import axios from "../../../axios";
import moment from "moment";
import { toast } from "react-hot-toast";

const AttendanceCard = () => {
  const [status, setStatus] = useState("");
  const [todayRecord, setTodayRecord] = useState(null);
  const [testMode, setTestMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(moment().format("HH:mm:ss"));

  useEffect(() => {
    loadAttendance();
    const timer = setInterval(() => {
      setCurrentTime(moment().format("HH:mm:ss"));
    }, 1000);
    return () => clearInterval(timer);
  }, [testMode]);

  const getTodayDate = () => {
    return testMode
      ? moment().add(1, "days").format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD");
  };

  const loadAttendance = async () => {
    try {
      const { data } = await axios.get("/attendance/history");
      const today = getTodayDate();
      const todayEntry = data.find(record => record.date === today);
      setTodayRecord(todayEntry);

      if (!todayEntry) setStatus("not_clocked_in");
      else if (todayEntry.clockIn && !todayEntry.clockOut) setStatus("clocked_in");
      else setStatus("done");
    } catch (err) {
      toast.error("Failed to load attendance data");
    }
  };

  const calculateCurrentHours = (clockInTime) => {
    if (!clockInTime) return "0h 0m";
    const start = moment(clockInTime, "HH:mm");
    const now = moment();
    const duration = moment.duration(now.diff(start));
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    return `${hours}h ${minutes}m`;
  };

  const handleClockIn = async () => {
    try {
      const { data } = await axios.post("/attendance/clock-in", { testMode });
      toast.success(data.message);
      loadAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || "Clock In failed");
    }
  };

  const handleClockOut = async () => {
    try {
      const { data } = await axios.post("/attendance/clock-out", { testMode });
      toast.success(data.message);
      loadAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || "Clock Out failed");
    }
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        {/* Header with date/time and status indicator */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold text-dark mb-1">
              <i className="bi bi-calendar-check me-2"></i>Daily Attendance
            </h5>
            <span className="text-muted small">{getTodayDate()}</span>
          </div>
          <div className="text-end">
            <div className="fs-4 fw-bold text-primary">{currentTime}</div>
            <div className="small text-muted">Local Time</div>
          </div>
        </div>

        {/* Test Mode Toggle */}
        <div className="form-check form-switch mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={testMode}
            onChange={() => setTestMode(!testMode)}
            id="testModeToggle"
          />
          <label className="form-check-label small text-muted" htmlFor="testModeToggle">
            <i className="bi bi-flask me-1"></i>Test Mode
          </label>
        </div>

        {/* Status Card */}
        <div className={`p-3 rounded-3 mb-3 ${status === "not_clocked_in" ? "bg-light-warning" :
          status === "clocked_in" ? "bg-light-primary" : "bg-light-success"}`}>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-semibold mb-0">Today's Status</h6>
            {status === "not_clocked_in" && (
              <span className="badge bg-warning text-dark">Awaiting Check-in</span>
            )}
            {status === "clocked_in" && (
              <span className="badge bg-primary">Checked In</span>
            )}
            {status === "done" && (
              <span className="badge bg-success">Completed</span>
            )}
          </div>

          {/* Status Content */}
          <div className="text-center py-2">
            {status === "not_clocked_in" && (
              <>
                <div className="mb-3">
                  <i className="bi bi-door-open fs-1 text-warning"></i>
                  <p className="mt-2">You haven't checked in yet</p>
                </div>
                <button
                  className="btn btn-success w-100 py-2 fw-bold"
                  onClick={handleClockIn}
                >
                  <i className="bi bi-fingerprint me-2"></i>Check In
                </button>
              </>
            )}

            {status === "clocked_in" && (
              <>
                <div className="mb-3">
                  <i className="bi bi-clock-history fs-1 text-primary"></i>
                  <p className="mt-2 mb-1">
                    <span className="d-block">Checked in at</span>
                    <strong className="fs-4">{todayRecord?.clockIn}</strong>
                  </p>
                  <div className="text-muted small mt-2">
                    <i className="bi bi-info-circle me-1"></i>
                    Working time: {calculateCurrentHours(todayRecord?.clockIn)}
                  </div>
                </div>
                <button
                  className="btn btn-danger w-100 py-2 fw-bold"
                  onClick={handleClockOut}
                >
                  <i className="bi bi-box-arrow-right me-2"></i>Check Out
                </button>
              </>
            )}

            {status === "done" && (
              <>
                <div className="mb-2">
                  <i className="bi bi-check-circle fs-1 text-success"></i>
                </div>
                <div className="d-flex justify-content-around text-center mb-3">
                  <div>
                    <div className="small text-muted">Check In</div>
                    <div className="fw-bold">{todayRecord?.clockIn}</div>
                  </div>
                  <div>
                    <div className="small text-muted">Check Out</div>
                    <div className="fw-bold">{todayRecord?.clockOut}</div>
                  </div>
                  <div>
                    <div className="small text-muted">Total</div>
                    <div className="fw-bold">{todayRecord?.totalHours}</div>
                  </div>
                </div>
                <div className="alert alert-success small mb-0">
                  <i className="bi bi-check2-circle me-1"></i>
                  Attendance completed for today
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCard;