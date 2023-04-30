import React, { useContext, useEffect } from "react";
import "./Booking.css";
import Footer from "../../../../utils/Footer";
import BookingCard from "../BookingCard/BookingCard";
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
import { AlertContext } from "../../../../../context/Alert/Alert";
import Loading from "../../../../utils/Loading";
import { AuthContext } from "../../../../../context/Authentication/AuthState";

const FACILITY_NAMES = [
  "Studio",
  "Pool",
  "Fitness Room",
  "Climbing Wall",
  "Sports Hall",
  "Squast Court 1",
  "Squash Court 2",
];
//const FACILITY_TYPES = [STUDIO, POOL, FITNESS_ROOM, CLIMBING_WALL, CLIMBING_WALL, SPORTS_HALL, SQUASH_COURT_1, SQUASH_COURT_2]

const Booking = () => {
  const { SetAlert, ToggleLoading, isLoading } = useContext(AlertContext);
  const { PutFacility, GetFacility, ...facilities } =
    useContext(FacilitiesContext);
  const { GetCustomerDetails } = useContext(AuthContext);

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
    ToggleLoading(true);
    GetCustomerDetails(localStorage.getItem("customer_email"));
    getFacilities().then(() => {
      ToggleLoading(false);
    });
  }, []);
  const filteredActivities = Object.values(facilities).filter(
    (facility) => facility?.Activities?.length > 0
  );

  if (localStorage.getItem("customer_email")) {
    return isLoading ? (
      <Loading />
    ) : (
      <>
        <br></br>
        <h1 style={{ textAlign: "center", color: "white" }}>Activities </h1>
        {filteredActivities.length > 0 ? (
          filteredActivities.map((facility, index) => {
            return (
              <div className="booking-main" key={index}>
                <div>
                  <h3 className="facility-heading">{FACILITY_NAMES[index]}</h3>
                  <h3 className="facility-heading">
                    Opening From : {facility.OpenTime} - {facility.CloseTime}{" "}
                  </h3>

                  <h3 className="facility-heading">
                    Capacity: {facility.Capacity}
                  </h3>
                </div>
                {facility?.Activities?.length > 0 && (
                  <div className="activities-container">
                    {facility.Activities.map((activity, index2) => (
                      <BookingCard
                        key={index2}
                        OpenTime={facility.OpenTime}
                        CloseTime={facility.CloseTime}
                        {...activity}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ paddingBottom: "300px" }}></div>
        )}
        <Footer />
      </>
    );
  } else {
    SetAlert("Please choose a customer first from the homepage");
    return <div></div>;
  }
};

export default Booking;