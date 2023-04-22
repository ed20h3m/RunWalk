import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaCalendarAlt } from "react-icons/fa";
import { useEffect } from "react";
import "./CalendarWidget.css";

const CalendarWidget = (props) => {

  const {Date:bookedDate, setUpdatedDate} = props;

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(bookedDate ? new Date(bookedDate): new Date());

  useEffect(()=>{
    setUpdatedDate(selectedDate);
  },[selectedDate])

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
      <div style={{display:'flex', justifyContent:'center'}}>
      <h1>Date: </h1>
      <FaCalendarAlt
        size = {16}
        onClick={toggleCalendar}
        style = {{marginTop:'8px', marginLeft:'10px'}}
      />
      </div>
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
