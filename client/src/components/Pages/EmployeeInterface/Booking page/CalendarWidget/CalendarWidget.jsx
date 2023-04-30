import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useEffect } from "react";
import "./CalendarWidget.css";
import { Grid } from "@mui/material";
const CalendarWidget = (props) => {
  const { Date: bookedDate, setUpdatedDate } = props;

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    setUpdatedDate(selectedDate);
  }, [selectedDate]);
  const minDate = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <div>
      <Grid container spacing={2} style={{ textAlign: "left" }}>
        <Grid item xs={12} sm={6} md={6} className="align-left">
          <h1 className="h1-title"> Date</h1>
        </Grid>
        <Grid item xs={12} sm={6} md={6} className="align-left">
          <FaCalendarAlt
            size={16}
            onClick={toggleCalendar}
            style={{ marginTop: "8px", marginLeft: "10px", color: "white" }}
          />{" "}
        </Grid>
      </Grid>
      {showCalendar && (
        <>
          <div className="calendar-backdrop" onClick={toggleCalendar} />
          <div className="calendar-container">
            <Calendar
              onChange={handleDateClick}
              value={selectedDate}
              minDate={minDate}
              maxDate={maxDate}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarWidget;