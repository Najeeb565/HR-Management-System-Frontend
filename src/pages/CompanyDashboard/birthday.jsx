import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CompanyContext } from "../../context/CompanyContext";

const BirthdayReminder = () => {
  const { company } = useContext(CompanyContext);
  const [birthdays, setBirthdays] = useState([]);

  // 🟢 Move useEffect out of conditional return
  useEffect(() => {
    const fetchBirthdays = async () => {
      if (!company) return; // check inside hook

      try {
        const res = await axios.get(
          `http://localhost:5000/api/admin/upcoming/${company._id}`
        );
        setBirthdays(res.data);
      } catch (err) {
        console.error("Error fetching birthdays", err);
      }
    };

    fetchBirthdays();
  }, [company]);

  // ❌ NEVER return before hook execution, so this is now safe
  if (!company) {
    return <p>Loading birthdays...</p>;
  }

  return (
    <div className="birthday-box">
      <h3>🎉 Upcoming Birthdays</h3>
      {birthdays.length === 0 ? (
        <p>No upcoming birthdays this week.</p>
      ) : (
        <ul>
          {birthdays.map((emp) => (
            <li key={emp._id}>
              {emp.name} -{" "}
              {new Date(emp.dateOfBirth).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BirthdayReminder;
