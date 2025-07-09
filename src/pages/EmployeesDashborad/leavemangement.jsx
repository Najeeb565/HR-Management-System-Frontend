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
  AccordionDetails,
  Divider,
  Stack,
  Avatar,
  useTheme
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
  Cancel as CancelIcon,
  CalendarToday as CalendarTodayIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from '../../axios';
import { EmployeeContext } from '../../context/EmployeeContext';
import dayjs from 'dayjs';

const StatusBadge = styled(Chip)(({ theme, status }) => ({
  fontWeight: 600,
  borderRadius: 4,
  backgroundColor: 
    status === 'Approved' ? theme.palette.success.light :
    status === 'Pending' ? theme.palette.warning.light :
    status === 'Rejected' ? theme.palette.error.light :
    theme.palette.grey[200],
  color: 
    status === 'Approved' ? theme.palette.success.dark :
    status === 'Pending' ? theme.palette.warning.dark :
    status === 'Rejected' ? theme.palette.error.dark :
    theme.palette.grey[800],
}));

const LeaveCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const LeaveManagement = () => {
  const theme = useTheme();
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
      case 'Approved': return <CheckCircleIcon color="success" fontSize="small" />;
      case 'Pending': return <PendingIcon color="warning" fontSize="small" />;
      case 'Rejected': return <CancelIcon color="error" fontSize="small" />;
      default: return <PendingIcon fontSize="small" />;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, margin: '0 auto' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight="600">
          Leave Management
        </Typography>
        {view === 'list' && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setView('form')}
            sx={{ 
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              py: 1
            }}
          >
            New Leave Request
          </Button>
        )}
      </Stack>

      {view === 'form' && (
        <LeaveCard sx={{ mb: 4, borderRadius: 2 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="600">
                New Leave Request
              </Typography>
              <IconButton onClick={() => setView('list')} size="small">
                <CloseIcon />
              </IconButton>
            </Stack>
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
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
                  <Stack direction="row" spacing={2}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <CalendarTodayIcon 
                            color="action" 
                            sx={{ mr: 1, fontSize: 20 }} 
                          />
                        ),
                      }}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                    <TextField
                      fullWidth
                      label="End Date"
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <CalendarTodayIcon 
                            color="action" 
                            sx={{ mr: 1, fontSize: 20 }} 
                          />
                        ),
                      }}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </Stack>
                  {startDate && endDate && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      {calculateLeaveDays(startDate, endDate)} day(s)
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Reason for Leave"
                    multiline
                    rows={4}
                    size="small"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    <Button 
                      variant="outlined" 
                      onClick={() => setView('list')}
                      sx={{ borderRadius: 2, px: 3 }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained"
                      sx={{ 
                        borderRadius: 2,
                        px: 3,
                        textTransform: 'none'
                      }}
                    >
                      Submit Request
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </LeaveCard>
      )}

      {view === 'list' && (
        <Box>
          <Typography variant="h6" fontWeight="600" mb={3}>
            My Leave History
          </Typography>
          
          {leaveList.length === 0 ? (
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 2,
                backgroundColor: theme.palette.grey[50]
              }}
            >
              <Avatar sx={{ 
                bgcolor: theme.palette.grey[200], 
                color: theme.palette.text.secondary,
                width: 56, 
                height: 56,
                mb: 2,
                mx: 'auto'
              }}>
                <EventIcon fontSize="large" />
              </Avatar>
              <Typography variant="body1" color="text.secondary" mb={2}>
                You haven't submitted any leave requests yet.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => setView('form')}
                sx={{ borderRadius: 2, px: 3 }}
              >
                Request Leave
              </Button>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {leaveList.map((leave, index) => (
                <LeaveCard key={index} sx={{ borderRadius: 2 }}>
                  <Accordion 
                    expanded={expanded === `panel${index}`}
                    onChange={handleAccordionChange(`panel${index}`)}
                    disableGutters
                    elevation={0}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        px: 3,
                        py: 2,
                        '& .MuiAccordionSummary-content': {
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          my: 0
                        }
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ 
                          bgcolor: theme.palette.grey[100], 
                          width: 32, 
                          height: 32,
                          color: theme.palette.text.primary
                        }}>
                          {getStatusIcon(leave.status)}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="600">{leave.leaveType}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {dayjs(leave.startDate).format('MMM D')} - {dayjs(leave.endDate).format('MMM D, YYYY')}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Chip 
                          label={`${calculateLeaveDays(leave.startDate, leave.endDate)} day(s)`} 
                          size="small" 
                          variant="outlined"
                          sx={{ borderRadius: 1 }}
                        />
                        <StatusBadge 
                          label={leave.status} 
                          status={leave.status} 
                          size="small" 
                        />
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 3, pt: 0, pb: 3 }}>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Stack spacing={2}>
                            <Stack direction="row" spacing={2}>
                              <EventIcon color="action" fontSize="small" />
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Dates
                                </Typography>
                                <Typography>
                                  {dayjs(leave.startDate).format('MMMM D, YYYY')} to {dayjs(leave.endDate).format('MMMM D, YYYY')}
                                </Typography>
                              </Box>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                              <WorkIcon color="action" fontSize="small" />
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  Leave Type
                                </Typography>
                                <Typography>{leave.leaveType}</Typography>
                              </Box>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Stack direction="row" spacing={2}>
                            <DescriptionIcon color="action" fontSize="small" />
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Reason
                              </Typography>
                              <Typography>{leave.reason}</Typography>
                            </Box>
                          </Stack>
                        </Grid>
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </LeaveCard>
              ))}
            </Stack>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LeaveManagement;