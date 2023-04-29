import React, { useEffect, useContext, useState, Fragment } from "react";
import "./CustomerActivityPage.css";
import Activity from "./Activity";
import { SessionContext } from "../../../context/Sessions/SessionState";
import { FacilitiesContext } from "../../../context/Facilities/FacilitiesState";
import { AlertContext } from "../../../context/Alert/Alert";
import { AuthContext } from "../../../context/Authentication/AuthState";
import BookForm from "./BookForm";
import Loading from "../../utils/Loading";
import {
  POOL,
  STUDIO,
  FITNESS_ROOM,
  SPORTS_HALL,
  SQUASH_COURT_1,
  SQUASH_COURT_2,
  CLIMBING_WALL,
} from "../../../context/types";
import Footer from "../../utils/Footer";

const CustomerActivityPage = () => {
  const {
    GetPoolSessions,
    GetStudioSessions,
    GetClimbingWallSessions,
    GetSquashCourt1Sessions,
    GetSquashCourt2Sessions,
    GetSportsHallSessions,
    GetFitnessRoomSessions,
    SportsHallSessions,
    PoolSessions,
    StudioSessions,
    ClimbingWallSessions,
    SquashCourt1Sessions,
    SquashCourt2Sessions,
    FitnessRoomSessions,
    GetInfo,
  } = useContext(SessionContext);
  const {
    Studio,
    Pool,
    FitnessRoom,
    ClimbingWall,
    SquashCourt1,
    SquashCourt2,
    SportsHall,
    GetFacility,
  } = useContext(FacilitiesContext);
  const { isLoading, ToggleOverlay, SetAlert, showBookForm } =
    useContext(AlertContext);
  const { GetCustomer } = useContext(AuthContext);
  const [state, setState] = useState({});
  // const [config, setConfig] = useState({
  //   showForm: false,
  // });
  useEffect(() => {
    GetCustomer();
    GetInfo();
  }, []);
  const setSession = (activity) => {
    setState({ ...activity });
  };
  // const setForm = () => {
  //   setConfig({ ...config, showForm: !config.showForm });
  // };
  useEffect(() => {
    const call = async () => {
      await GetPoolSessions();
      await GetStudioSessions();
      await GetClimbingWallSessions();
      await GetSquashCourt1Sessions();
      await GetSquashCourt2Sessions();
      await GetSportsHallSessions();
      await GetFitnessRoomSessions();
    };
    call();
  }, []);
  useEffect(() => {
    const call = async () => {
      await GetFacility(POOL);
      await GetFacility(STUDIO);
      await GetFacility(CLIMBING_WALL);
      await GetFacility(SQUASH_COURT_1);
      await GetFacility(SQUASH_COURT_2);
      await GetFacility(SPORTS_HALL);
      await GetFacility(FITNESS_ROOM);
    };
    call();
  }, []);
  return isLoading ? (
    <Loading />
  ) : (
    <Fragment>
      <div className="bg-img">1</div>
      <div className="activity-page">
        {showBookForm && (
          <BookForm
            ToggleOverlay={ToggleOverlay}
            SetAlert={SetAlert}
            session={state}
          />
        )}
        <div className="activity-container">
          <div className="activities-header">
            <div>
              <h1>Swimming Pool</h1>
              <h3>Capacity : {Pool.Capacity} </h3>
            </div>
            <div>
              <h3>
                {Pool.OpenTime} - {Pool.CloseTime}
              </h3>
            </div>
          </div>
          <div className="activities-con">
            {PoolSessions.map((element, idx) => (
              <Activity activity={element} key={idx} setSession={setSession} />
            ))}
          </div>
        </div>
        <div className="activity-container">
          <div className="activities-header">
            <div>
              <h1>Sports Hall</h1>
              <h3>Capacity : {SportsHall.Capacity} </h3>
            </div>
            <div>
              <h3>
                {SportsHall.OpenTime} - {SportsHall.CloseTime}
              </h3>
            </div>
          </div>
          <div className="activities-con">
            {SportsHallSessions.map((element, idx) => (
              <Activity activity={element} key={idx} setSession={setSession} />
            ))}
          </div>
        </div>
        <div className="activity-container">
          <div className="activities-header">
            <div>
              <h1>Fitness Room</h1>
              <h3>Capacity : {FitnessRoom.Capacity} </h3>
            </div>
            <div>
              <h3>
                {FitnessRoom.OpenTime} - {FitnessRoom.CloseTime}
              </h3>
            </div>
          </div>
          <div className="activities-con">
            {FitnessRoomSessions.map((element, idx) => (
              <Activity activity={element} key={idx} setSession={setSession} />
            ))}
          </div>
        </div>
        <div className="activity-container">
          <div className="activities-header">
            <div>
              <h1>Squash Court 1</h1>
              <h3>Capacity : {SquashCourt1.Capacity} </h3>
            </div>
            <div>
              <h3>
                {SquashCourt1.OpenTime} - {SquashCourt1.CloseTime}
              </h3>
            </div>
          </div>
          <div className="activities-con">
            {SquashCourt1Sessions.map((element, idx) => (
              <Activity activity={element} key={idx} setSession={setSession} />
            ))}
          </div>
        </div>
        <div className="activity-container">
          <div className="activities-header">
            <div>
              <h1>Squash Court 2</h1>
              <h3>Capacity : {SquashCourt2.Capacity} </h3>
            </div>
            <div>
              <h3>
                {SquashCourt2.OpenTime} - {SquashCourt2.CloseTime}
              </h3>
            </div>
          </div>
          <div className="activities-con">
            {SquashCourt2Sessions.map((element, idx) => (
              <Activity activity={element} key={idx} setSession={setSession} />
            ))}
          </div>
        </div>
        <div className="activity-container">
          <div className="activities-header">
            <div>
              <h1>Wall Climbing</h1>
              <h3>Capacity : {ClimbingWall.Capacity} </h3>
            </div>
            <div>
              <h3>
                {ClimbingWall.OpenTime} - {ClimbingWall.CloseTime}
              </h3>
            </div>
          </div>
          <div className="activities-con">
            {ClimbingWallSessions.map((element, idx) => (
              <Activity activity={element} key={idx} setSession={setSession} />
            ))}
          </div>
        </div>
        <div className="activity-container">
          <div className="activities-header">
            <div>
              <h1>Studio</h1>
              <h3>Capacity : {Studio.Capacity} </h3>
            </div>
            <div>
              <h3>
                {Studio.OpenTime} - {Studio.CloseTime}
              </h3>
            </div>
          </div>
          <div className="activities-con">
            {StudioSessions.map((element, idx) => (
              <Activity activity={element} key={idx} setSession={setSession} />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};
export default CustomerActivityPage;
