import React, { useEffect, useState, useContext } from "react";
import Attendance from "./attendance/AttendancePage";
import AttendanceChart from "./attendance/AttendanceChart";
import GlobalChatBox from "../../components/chat/globalchat";
import axios from "../../axios";
import ProfileCard from "./profile/profilecard";
import { EmployeeContext } from "../../context/EmployeeContext";

const EmpDashboard = () => {
  const { employee } = useContext(EmployeeContext);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCard, setShowCard] = useState(false);

  const currentUser = {
    name: "Hamza",
    role: "Employee",
    _id: "emp123", // Optional, use if needed
  };

  // 🎂 Fetch Birthday List
  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const res = await axios.get("/birthdays/upcoming");
        const all = [...res.data.employees, ...res.data.admins];
        setUpcomingBirthdays(all);
      } catch (error) {
        console.error("Error fetching upcoming birthdays:", error);
      }
    };

    fetchBirthdays();
  }, []);

  // 🕓 Fetch Attendance History
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get("/attendance/history");
        setAttendanceHistory(data);
        console.log("Employee Profile Picture:", employee?.profilePicture);
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
      originalDate: record.date, // keep full date for tooltips
    };
  });

  return (
    <div className="container-fluid px-4 py-3">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        {/* Title */}
        <div>
          <h2 className="mb-0 fw-semibold text-dark">Employee Dashboard</h2>
        </div>

        {/* Profile + Date Section */}
        <div className="d-flex flex-column align-items-end position-relative">
          <img
            src={employee?.profilePicture || "/default-avatar.png"}
            alt="Profile"
            className="rounded-circle border shadow-sm mb-1"
            style={{
              width: "48px",
              height: "48px",
              objectFit: "cover",
              cursor: "pointer",
            }}
            onClick={() => setShowCard(!showCard)}
          />

          {showCard && (
            <div
              className="position-absolute"
              style={{
                top: "55px",
                right: 0,
                zIndex: 1050,
              }}
            >
              <ProfileCard onClose={() => setShowCard(false)} />
            </div>
          )}

          <div className="text-muted small mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
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

          {/* Chat Box */}
          <div className="col-xl-6 col-lg-12">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <GlobalChatBox currentUser={currentUser} />
              </div>
            </div>
          </div>

          {/* 🎂 Upcoming Birthdays */}
          <div className="col-xl-6 col-lg-12">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">🎂 Upcoming Birthdays</h5>
                {upcomingBirthdays.length > 0 ? (
                  <ul className="list-group list-group-flush">
                    {upcomingBirthdays.map((person) => (
                      <li key={person._id} className="list-group-item">
                        <strong>{person.name}</strong> -{" "}
                        {new Date(person.birthday).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted mb-0">No upcoming birthdays.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpDashboard;
