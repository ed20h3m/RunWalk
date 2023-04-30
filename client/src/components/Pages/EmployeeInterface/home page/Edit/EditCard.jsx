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
import { Grid } from "@mui/material";
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
  const { GetSessions, EditSession, DeleteSession, BookedSessions } =
    useContext(SessionContext);
  const { ToggleLoading, SetAlert } = useContext(AlertContext);
  const [updatedDate, setUpdatedDate] = useState(new Date(bookedDate));
  const [updatedTime, setUpdatedTime] = useState(null);
  const [OpenTime, setOpenTime] = useState(null);
  const [CloseTime, setCloseTime] = useState(null);
  return (
    <div className="edit-card">
      <Grid container spacing={2} style={{ textAlign: "left" }}>
        {" "}
        <Grid item xs={6} sm={6} md={6} className="align-left">
          <h1 className="h1-title"> Activity</h1>{" "}
        </Grid>{" "}
        <Grid item xs={6} sm={6} md={6} className="align-left">
          <h1 className="h1-title"> {Activity}</h1>{" "}
        </Grid>
        <Grid item xs={6} sm={6} md={6} className="align-top">
          <h1 className="h1-title">Duration</h1>{" "}
        </Grid>{" "}
        <Grid item xs={6} sm={6} md={6} className="align-top">
          <h1 className="h1-title"> {Duration} mins</h1>{" "}
        </Grid>{" "}
      </Grid>
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
      <Grid container spacing={2} className="btn-controls">
        <Grid item xs={12} sm={4} md={4}>
          <button
            className="update-button"
            onClick={() => {
              if (updatedTime) {
                const { setisEdit, ...otherProps } = props;

                const session = {
                  ...otherProps,
                  Date: new Date(updatedDate)
                    .toLocaleDateString("en-CA")
                    .replace(/\//g, "-"),
                  Time: updatedTime,
                };
                const now = new Date();
                const hours = now.getHours().toString().padStart(2, "0");
                const minutes = now.getMinutes().toString().padStart(2, "0");
                const newTime = `${hours}:${minutes}`;
                const year = now.getFullYear();
                const month = (now.getMonth() + 1).toString().padStart(2, "0");
                const day = now.getDate().toString().padStart(2, "0");
                const newDate = `${year}-${month}-${day}`;

                if (session.Time < newTime && newDate === session.Date) {
                  SetAlert("Invalid timeslot! Please choose a valid timeslot");
                } else {
                  if (
                    BookedSessions.find(
                      (activity) =>
                        activity.Date.split(" ")[0] === session.Date &&
                        activity.Date.split(" ")[1] === session.Time
                    )
                  ) {
                    SetAlert(
                      "invalid! there’s an existing session with the same date and time"
                    );
                  } else {
                    ToggleLoading(true);
                    EditSession(session).then(() => {
                      GetSessions(localStorage["customer_email"]).then(() => {
                        ToggleLoading(false);
                      });
                    });
                  }
                }
              } else {
                SetAlert("Please select a time!");
              }
            }}
          >
            Update
          </button>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          {" "}
          <button
            className="cancel-button"
            onClick={() => {
              setisEdit(false);
            }}
          >
            Cancel
          </button>
        </Grid>
        <Grid item xs={12} sm={4} md={4}>
          <button
            className="delete-button"
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
          </button>{" "}
        </Grid>
      </Grid>
    </div>
  );
};

export default EditCard;
