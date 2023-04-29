import React, { useState, useContext, useEffect } from "react";
import { SessionContext } from "../../../../../context/Sessions/SessionState";
import "./TimeCards.css"; // import the CSS file for styling
import { AuthContext } from "../../../../../context/Authentication/AuthState";




function getAvailableTimes(OpenTime, CloseTime, Duration) {
  let openHour = parseInt(OpenTime.slice(0, -2));
  const openAmPm = OpenTime.slice(-2);
  openHour = openAmPm  === "pm" ? openHour + 12 : openHour 
  
  let closeHour = parseInt(CloseTime.slice(0, -2));
  const closeAmPm = CloseTime.slice(-2);
  closeHour = closeAmPm === "pm" ? closeHour + 12 : closeHour 

  const durationHour = parseInt(Duration)/ 60;
 

  const availableTimes = [];
  while(openHour !== closeHour)
  {
    if(openHour < 10)
    availableTimes.push( "0" + openHour.toString() + ":00")
    else
    availableTimes.push(openHour.toString() + ":00")
    openHour += durationHour
    openHour = openHour % 24
  }
   
  return availableTimes;
}

const TimeCards = ({OpenTime, CloseTime, Duration, setUpdatedTime}) => {
  const [selectedTime, setSelectedTime] = useState(null); // state to keep track of the selected time
  const [availableTimes, setAvailableTimes] = useState([])
  
  useEffect(()=>{
    if(OpenTime && CloseTime && Duration)
   setAvailableTimes(getAvailableTimes(OpenTime, CloseTime, Duration))
  },[])


  const handleTimeClick = (time) => { // event handler for when a time card is clicked
    setSelectedTime(time);
    setUpdatedTime(time)
  };

  return (
    <div className="time-cards-container">
      {availableTimes.length > 0 ? (
        availableTimes.map((time, id) => (
          <div
            key={id}
            className={`time-card ${selectedTime === time ? "selected" : ""}`}
            onClick={() => handleTimeClick(time)}
          >
            {time}
          </div>
        ))
      ) : (
        <div></div>
      )}
    </div>
  );  
};

export default TimeCards;
