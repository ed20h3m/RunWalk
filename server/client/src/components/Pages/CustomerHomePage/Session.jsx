import React, { Fragment, useState, useContext } from "react";
import { AlertContext } from "../../../context/Alert/Alert";
import { SessionContext } from "../../../context/Sessions/SessionState";
import Loading from "../../utils/Loading";
import "./Session.css";

const Session = ({ session, Email }) => {
  const [config, setConfig] = useState({
    inEdit: false,
  });
  const dateTime = session.Date.split(" ");
  const [state, setState] = useState({
    ...session,
    Time: dateTime[1],
    Date: dateTime[0],
  });
  const { SetAlert, isLoadingForm } = useContext(AlertContext);
  const { DeleteSession, EditSession, GetSessions, Capacities, GetCapacities } =
    useContext(SessionContext);
  const update = async () => {
    await EditSession(state);
    await GetSessions(Email);
  };
  const onChange = (e) => {
    const date1 = new Date();
    const date2 = new Date(e.target.value);
    let diffInDays;
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = date2.getTime() - date1.getTime();
    diffInDays = Math.round(diffInTime / oneDay);
    if (diffInDays <= -1) {
      return SetAlert("Invalid Date. Try again", "error");
    }
    if (diffInDays > 14) {
      return SetAlert("Invalid Date. Max 2 weeks in advance", "warning");
    }
    setState({ ...state, [e.target.name]: e.target.value });
    GetCapacities(e.target.value, session.Facility);
  };
  const setEdit = () => {
    setConfig({ ...config, inEdit: !config.inEdit });
  };
  const selectTime = (e) => {
    const elements = e.target.parentElement.children;
    for (let i = 0; i < elements.length; i++)
      elements[i].classList.remove("selected-time");
    e.target.classList.add("selected-time");
    setState({ ...state, [e.target.id]: e.target.innerHTML.slice(0, 5) });
  };
  return (
    <div className="session">
      <header>
        <h3>{session.Activity[0].toUpperCase() + session.Activity.slice(1)}</h3>
        {config.inEdit && (
          <div className="header-right">
            <input
              type="date"
              value={state.Date}
              onChange={onChange}
              name="Date"
            ></input>
            <button
              onClick={() => {
                DeleteSession(session);
                GetSessions(Email);
              }}
              className="button btn-delete"
            >
              Delete
            </button>
          </div>
        )}
      </header>
      {!config.inEdit ? (
        <div className="main-part">
          <div className="left">
            <h5>Time </h5>
            <h5>Date</h5>
            <h5>Facility</h5>
            <h5>Duration</h5>
          </div>
          <div className="right">
            <h5>{session.Date.split(" ")[1]}</h5>
            <h5>{session.Date.split(" ")[0]}</h5>
            <h5>{session.Facility}</h5>
            <h5>{session.Duration} Mins</h5>
          </div>
        </div>
      ) : (
        <div className="times-lots-con">
          {isLoadingForm ? (
            <Loading />
          ) : Capacities.length > 0 ? (
            <div className="time-slots">
              {Capacities.map((element, idx) => (
                <h6 className="slot" id="Time" onClick={selectTime} key={idx}>
                  {element.timeSlot.slice(11, 16)} <br /> {element.count} left
                </h6>
              ))}
            </div>
          ) : (
            <div className="center-text">
              <h5>Pick a Date</h5>
            </div>
          )}
        </div>
      )}
      <footer>
        {!config.inEdit ? (
          <Fragment>
            <button onClick={() => setEdit()} className="button btn-edit">
              Edit
            </button>
          </Fragment>
        ) : (
          <Fragment>
            <button onClick={() => setEdit()} className="button btn-cancel">
              Cancel
            </button>
            <button
              onClick={() => {
                setEdit();
                update();
              }}
              className="button btn-update"
            >
              Update
            </button>
          </Fragment>
        )}
      </footer>
    </div>
  );
};

export default Session;
