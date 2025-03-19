import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Paper,
  Avatar,
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  Button, 
  Snackbar, 
  Alert
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

export const Appointment = () => {
  const [doctors, setDoctors] = useState([
    { _id: "1", firstName: "John", lastName: "Doe", specialization: "Cardiologist" },
    { _id: "2", firstName: "Jane", lastName: "Smith", specialization: "Dentist" },
    { _id: "3", firstName: "Mark", lastName: "Taylor", specialization: "Dermatologist" }
  ]);
  
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Mock available time slots
  const mockSlots = {
    "1": ["09:00", "10:30", "14:00"],
    "2": ["08:00", "11:00", "15:30"],
    "3": ["10:00", "12:30", "16:00"]
  };

  // Update available slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      setAvailableSlots(mockSlots[selectedDoctor] || []);
    }
  }, [selectedDoctor, selectedDate]);

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
    setSelectedTime(null);
  };

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setSelectedTime(null);
  };

  const handleTimeSelection = (time) => {
    setSelectedTime(time);
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason) {
      setNotification({
        open: true,
        message: "Please fill all the details before booking!",
        severity: "error"
      });
      return;
    }

    setNotification({
      open: true,
      message: "Appointment booked successfully!",
      severity: "success"
    });

    // Reset form
    setSelectedDoctor('');
    setSelectedDate(null);
    setSelectedTime(null);
    setReason('');
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const renderTimeSlots = () => {
    if (!availableSlots.length) {
      return (
        <Box mt={2}>
          <Typography variant="body1" color="text.secondary">
            No available slots for the selected date. Please try another date.
          </Typography>
        </Box>
      );
    }

    return (
      <Box mt={2}>
        <Typography variant="h6" gutterBottom>
          Available Time Slots
        </Typography>
        <Grid container spacing={1}>
          {availableSlots.map((slot) => (
            <Grid item key={slot}>
              <Button
                variant={selectedTime === slot ? "contained" : "outlined"}
                color="primary"
                onClick={() => handleTimeSelection(slot)}
                sx={{ minWidth: '100px' }}
              >
                {format(new Date(`2023-01-01T${slot}`), 'h:mm a')}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 56, height: 56 }}>
            <MedicalServicesIcon fontSize="large" />
          </Avatar>
          <Typography component="h1" variant="h4" gutterBottom>
            Schedule an Appointment
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            Select a doctor, date, and time to book your appointment.
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
                <Select
                  labelId="doctor-select-label"
                  id="doctor-select"
                  value={selectedDoctor}
                  label="Select Doctor"
                  onChange={handleDoctorChange}
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor._id} value={doctor._id}>
                      Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  disablePast
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12}>
              {selectedDoctor && selectedDate && renderTimeSlots()}
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Reason for Visit"
                multiline
                rows={4}
                fullWidth
                value={reason}
                onChange={handleReasonChange}
                placeholder="Please briefly describe the reason for your appointment"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={!selectedDoctor || !selectedDate || !selectedTime}
                sx={{ mt: 2 }}
              >
                Book Appointment
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
