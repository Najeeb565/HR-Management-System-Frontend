import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Chip, 
  FormControl, 
  Grid, 
  IconButton, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Add as AddIcon, 
  Close as CloseIcon, 
  ExpandMore as ExpandMoreIcon,
  Event as EventIcon,
  Description as DescriptionIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from '../../axios';
import { EmployeeContext } from '../../context/EmployeeContext';
import dayjs from 'dayjs';

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 'bold',
  backgroundColor: 
    status === 'Approved' ? theme.palette.success.light :
    status === 'Pending' ? theme.palette.warning.light :
    status === 'Rejected' ? theme.palette.error.light :
    theme.palette.grey[300],
  color: 
    status === 'Approved' ? theme.palette.success.dark :
    status === 'Pending' ? theme.palette.warning.dark :
    status === 'Rejected' ? theme.palette.error.dark :
    theme.palette.grey[800],
}));

const LeaveManagement = () => {
  const employee = useContext(EmployeeContext);
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveList, setLeaveList] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`/leaves?employeeId=${employee?.employee?._id}`);
      setLeaveList(res.data);
      console.log('Leaves fetched successfully:', res.data);
    } catch (err) {
      console.error('Error fetching leaves:', err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLeave = {
      leaveType,
      startDate,
      endDate,
      reason,
      employeeId: employee?.employee?._id,
      companyId: employee?.employee?.companyId 
    };

    try {
      await axios.post('/leaves', newLeave);
      setLeaveType('');
      setStartDate('');
      setEndDate('');
      setReason('');
      setView('list');
      fetchLeaves();
    } catch (err) {
      console.error('Error submitting leave:', err);
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null);
  };

  const calculateLeaveDays = (start, end) => {
    const startDay = dayjs(start);
    const endDay = dayjs(end);
    return endDay.diff(startDay, 'day') + 1;
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircleIcon color="success" />;
      case 'Pending': return <PendingIcon color="warning" />;
      case 'Rejected': return <CancelIcon color="error" />;
      default: return <PendingIcon />;
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
          Leave Management
        </Typography>
        {view === 'list' && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setView('form')}
            sx={{ 
              backgroundColor: '#4a6baf',
              '&:hover': { backgroundColor: '#3a5a9f' }
            }}
          >
            Apply for Leave
          </Button>
        )}
      </Box>

      {view === 'form' && (
        <Card sx={{ mb: 4, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                New Leave Application
              </Typography>
              <IconButton onClick={() => setView('list')}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="leave-type-label">Leave Type</InputLabel>
                    <Select
                      labelId="leave-type-label"
                      id="leaveType"
                      value={leaveType}
                      label="Leave Type"
                      onChange={(e) => setLeaveType(e.target.value)}
                      required
                    >
                      <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                      <MenuItem value="Urgent Leave">Urgent Leave</MenuItem>
                      <MenuItem value="Annual Leave">Annual Leave</MenuItem>
                      <MenuItem value="Paternity Leave">Paternity Leave</MenuItem>
                      <MenuItem value="Bereavement Leave">Bereavement Leave</MenuItem>
                      <MenuItem value="Compensatory Leave">Compensatory Leave</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </Box>
                  {startDate && endDate && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {calculateLeaveDays(startDate, endDate)} day(s)
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reason"
                    multiline
                    rows={4}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => setView('list')}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained"
                      sx={{ 
                        backgroundColor: '#4a6baf',
                        '&:hover': { backgroundColor: '#3a5a9f' }
                      }}
                    >
                      Submit Application
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      )}

      {view === 'list' && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            My Leave Applications
          </Typography>
          
          {leaveList.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                You haven't submitted any leave applications yet.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setView('form')}
                sx={{ mt: 2 }}
              >
                Apply for Leave
              </Button>
            </Paper>
          ) : (
            <Box>
              {leaveList.map((leave, index) => (
                <Accordion 
                  key={index} 
                  expanded={expanded === `panel${index}`}
                  onChange={handleAccordionChange(`panel${index}`)}
                  sx={{ mb: 1, boxShadow: 1 }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{
                      '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {getStatusIcon(leave.status)}
                      <Typography sx={{ fontWeight: 'bold' }}>{leave.leaveType}</Typography>
                      <Chip 
                        label={`${calculateLeaveDays(leave.startDate, leave.endDate)} day(s)`} 
                        size="small" 
                        variant="outlined" 
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {dayjs(leave.startDate).format('MMM D')} - {dayjs(leave.endDate).format('MMM D, YYYY')}
                      </Typography>
                      <StatusChip label={leave.status} status={leave.status} size="small" />
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <EventIcon color="action" sx={{ mr: 1 }} />
                          <Typography>
                            <strong>Dates:</strong> {dayjs(leave.startDate).format('MMMM D, YYYY')} to {dayjs(leave.endDate).format('MMMM D, YYYY')}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <WorkIcon color="action" sx={{ mr: 1 }} />
                          <Typography>
                            <strong>Type:</strong> {leave.leaveType}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <DescriptionIcon color="action" sx={{ mr: 1, mt: 0.5 }} />
                          <Typography>
                            <strong>Reason:</strong> {leave.reason}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LeaveManagement;