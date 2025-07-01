import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from "recharts";
import { format, parseISO } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const totalHours = payload[0].value;
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    
    // Safely parse and format the date
    let dateDisplay = `Day ${label.split('-')[1]}`; // Default fallback
    try {
      const [month, day] = label.split('-');
      if (month && day) {
        const currentYear = new Date().getFullYear();
        const date = new Date(currentYear, parseInt(month) - 1, parseInt(day));
        if (!isNaN(date.getTime())) {
          dateDisplay = format(date, 'MMMM d');
        }
      }
    } catch (e) {
      console.warn('Date formatting error:', e);
    }
    
    return (
      <div className="bg-white p-3 shadow-sm border rounded">
        <p className="fw-bold mb-1">{dateDisplay}</p>
        <p className="mb-0">
          <span className="badge bg-primary me-2">Hours</span>
          {hours}h {minutes}m
        </p>
      </div>
    );
  }
  return null;
};

const AttendanceChart = ({ data }) => {
  // Calculate average hours for reference line
  const averageHours = data.length > 0 
    ? data.reduce((sum, entry) => sum + entry.hours, 0) / data.length
    : 0;

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mb-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="fw-bold mb-0">
          <i className="bi bi-calendar2-week me-2 text-primary"></i>Monthly Attendance
        </h6>
        <div className="text-muted small">
          {format(new Date(), 'MMMM yyyy')}
        </div>
      </div>
      
      <div className="d-flex mb-3">
        <div className="me-3">
          <span className="badge bg-primary rounded-pill me-2">■</span>
          <span className="small">Work Hours</span>
        </div>
        <div>
          <span className="badge bg-secondary rounded-pill me-2">—</span>
          <span className="small">
            Daily Avg: {Math.floor(averageHours)}h {Math.round((averageHours % 1) * 60)}m
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.split('-')[1]} // Show only day
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `${value}h`}
            domain={[0, 12]}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={averageHours} 
            stroke="#6c757d" 
            strokeDasharray="3 3" 
            label={{
              position: 'right', 
              value: 'Avg', 
              fontSize: 12,
              fill: '#6c757d'
            }} 
          />
          <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.hours >= averageHours ? '#0d6efd' : '#ffc107'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="d-flex justify-content-between small text-muted mt-2">
        <div>
          <i className="bi bi-info-circle me-1"></i>
          Hover bars for details
        </div>
        <div>
          <span className="text-success me-2">
            <i className="bi bi-arrow-up"></i> Above avg
          </span>
          <span className="text-warning">
            <i className="bi bi-arrow-down"></i> Below avg
          </span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;