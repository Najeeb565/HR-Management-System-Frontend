// UpcomingBirthdaysCard.jsx
import React from "react";

const UpcomingBirthdaysCard = ({ upcomingBirthdays }) => {
  // Group birthdays by month
  const birthdaysByMonth = upcomingBirthdays.reduce((acc, person) => {
    const month = new Date(person.birthday).toLocaleDateString('en-US', { month: 'long' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(person);
    return acc;
  }, {});

  return (
    <div className="card border-0 h-100" style={{ 
      borderRadius: "16px",
      background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)"
    }}>
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="mb-1" style={{ 
              fontWeight: "700",
              color: "#2d3436",
              letterSpacing: "-0.5px"
            }}>
              Birthday Calendar
            </h5>
            <p className="text-muted small mb-0">
              {upcomingBirthdays.length} upcoming {upcomingBirthdays.length === 1 ? 'celebration' : 'celebrations'}
            </p>
          </div>
          <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            backgroundColor: "rgba(255, 107, 107, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ff6b6b",
            fontSize: "20px"
          }}>
            🎂
          </div>
        </div>
        
        {upcomingBirthdays.length > 0 ? (
          <div className="month-sections" style={{ maxHeight: "400px", overflowY: "auto" }}>
            {Object.entries(birthdaysByMonth).map(([month, birthdays]) => (
              <div key={month} className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <div style={{
                    width: "4px",
                    height: "24px",
                    backgroundColor: "#ff6b6b",
                    borderRadius: "2px",
                    marginRight: "12px"
                  }}></div>
                  <h6 style={{
                    fontWeight: "600",
                    color: "#2d3436",
                    marginBottom: "0",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontSize: "13px"
                  }}>
                    {month}
                  </h6>
                </div>
                
                <div className="row g-3">
                  {birthdays.map((person) => {
                    const birthday = new Date(person.birthday);
                    const isToday = new Date().toDateString() === birthday.toDateString();
                    const day = birthday.getDate();
                    const weekday = birthday.toLocaleDateString('en-US', { weekday: 'short' });
                    
                    return (
                      <div key={person._id} className="col-12">
                        <div className="d-flex align-items-center p-3" style={{
                          backgroundColor: isToday ? "rgba(255, 107, 107, 0.08)" : "#fff",
                          borderRadius: "12px",
                          border: isToday ? "1px solid rgba(255, 107, 107, 0.3)" : "1px solid rgba(0,0,0,0.05)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
                        }}>
                          <div style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "10px",
                            backgroundColor: isToday ? "rgba(255, 107, 107, 0.1)" : "#f5f5f5",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "16px",
                            flexShrink: 0
                          }}>
                            <span style={{
                              fontWeight: "700",
                              fontSize: "18px",
                              color: isToday ? "#ff6b6b" : "#2d3436"
                            }}>{day}</span>
                            <span style={{
                              fontSize: "10px",
                              fontWeight: "600",
                              color: isToday ? "#ff6b6b" : "#7f8c8d",
                              textTransform: "uppercase",
                              marginTop: "2px"
                            }}>{weekday}</span>
                          </div>
                          
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center">
                              <h6 className="mb-0" style={{ 
                                fontWeight: "600",
                                color: isToday ? "#ff6b6b" : "#2d3436"
                              }}>
                                {person.name}
                              </h6>
                              {person.age && (
                                <span style={{
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  color: "#7f8c8d",
                                  backgroundColor: "rgba(0,0,0,0.04)",
                                  padding: "2px 8px",
                                  borderRadius: "20px"
                                }}>
                                  {person.age} years
                                </span>
                              )}
                            </div>
                            <div className="d-flex align-items-center mt-1">
                              <img
                                src={
                                  person.profilePicture
                                    ? `http://localhost:5000/uploads/${person.profilePicture}`
                                    : "/default-avatar.png"
                                }
                                alt={person.name}
                                style={{
                                  width: "30px",
                                  height: "30px",
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                  marginRight: "8px"
                                }}
                              />
                              <span style={{
                                fontSize: "13px",
                                color: "#7f8c8d"
                              }}>
                                {birthday.toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5" style={{ color: "#b2bec3" }}>
            <div style={{ 
              fontSize: "72px",
              lineHeight: "1",
              marginBottom: "16px"
            }}>
              🎈
            </div>
            <h6 style={{ 
              fontWeight: "600",
              marginBottom: "8px",
              color: "#636e72"
            }}>
              No birthdays coming up
            </h6>
            <p className="small" style={{ maxWidth: "240px", margin: "0 auto" }}>
              When you add birthdays, they'll appear here sorted by date.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingBirthdaysCard;