import React, { useEffect } from "react";
import "./EditCard.css";
import CalendarWidget from "../../Booking page/CalendarWidget/CalendarWidget";
import TimeCards from "../../Booking page/TimeCards/TimeCards";
import { useState } from "react";
import { useContext } from "react";
import { SessionContext } from "../../../../../context/Sessions/SessionState";
import { AlertContext } from "../../../../../context/Alert/Alert";
import { FacilitiesContext } from "../../../../../context/Facilities/FacilitiesState";
import {
  POOL,
  STUDIO,
  FITNESS_ROOM,
  SPORTS_HALL,
  SQUASH_COURT_1,
  SQUASH_COURT_2,
  CLIMBING_WALL,
} from "../../../../../context/types";
const EditCard = (props) /* Destructuring the props */ => {
  const { Activity, Duration, Date: bookedDate, setisEdit, arrayName } = props;
  const { PutFacility, GetFacility, ...facilities } =
    useContext(FacilitiesContext);

  const getFacilities = async () => {
    try {
      await Promise.all([
        GetFacility(POOL),
        GetFacility(STUDIO),
        GetFacility(FITNESS_ROOM),
        GetFacility(SPORTS_HALL),
        GetFacility(SQUASH_COURT_1),
        GetFacility(SQUASH_COURT_2),
        GetFacility(CLIMBING_WALL),
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getFacilities();
  }, []);

  useEffect(() => {
    if (facilities[arrayName]) {
      setOpenTime(facilities[arrayName].OpenTime);
      setCloseTime(facilities[arrayName].CloseTime);
    }
  }, [facilities[arrayName]]);
  const { GetSessions, EditSession, DeleteSession } =
    useContext(SessionContext);
  const { ToggleLoading, SetAlert } = useContext(AlertContext);
  const [updatedDate, setUpdatedDate] = useState(new Date(bookedDate));
  const [updatedTime, setUpdatedTime] = useState(null);
  const [OpenTime, setOpenTime] = useState(null);
  const [CloseTime, setCloseTime] = useState(null);

  return (
    <div className="edit-card">
      <h1>Activity: {Activity}</h1>
      <h1>Duration: {Duration} mins</h1>
      <CalendarWidget
        Date={updatedDate}
        setUpdatedDate={setUpdatedDate}
      ></CalendarWidget>
      {OpenTime && CloseTime && (
        <TimeCards
          setUpdatedTime={setUpdatedTime}
          OpenTime={OpenTime}
          CloseTime={CloseTime}
          Duration={Duration}
        ></TimeCards>
      )}
      <button
        className="update-button"
        onClick={() => {
          if (updatedTime) {
            const { setisEdit, ...otherProps } = props;
            updatedDate.setDate(updatedDate.getDate() + 1);

            const session = {
              ...otherProps,
              Date: updatedDate.toISOString().slice(0, 10),
              Time: updatedTime,
            };
            ToggleLoading(true);
            EditSession(session).then(() => {
              GetSessions(localStorage["customer_email"]).then(() => {
                ToggleLoading(false);
              });
            });
          } else {
            SetAlert("Please select a time!");
          }
        }}
      >
        Update
      </button>
      <button
        className="cancel-button"
        onClick={() => {
          setisEdit(false);
        }}
      >
        Cancel
      </button>
      <button
        className="cancel-button"
        onClick={() => {
          const { setisEdit, ...otherProps } = props;
          ToggleLoading(true);
          DeleteSession(otherProps).then(() => {
            GetSessions(localStorage["customer_email"]).then(() => {
              ToggleLoading(false);
            });
          });
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default EditCard;
