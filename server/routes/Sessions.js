// This is where all sessions requests take place

/* Session:{
  _id,
  Email,
  Facility,
  Activity,
  Date,
  Duration
}
*/

// Import required packages
const express = require("express");
const router = express.Router();
const Session = require("../Models/Session");
const Customer = require("../Models/Customer");
router.use(express.json());
const CustomerAuthentication = require("../Middleware/CustomerAuthentication");
const EmployeeAuthentication = require("../Middleware/EmployeeAuthentication");
const { SessionSchema, SessionSchemaPut } = require("../Schemas/SessionSchema");
const { EmailSchema } = require("../Schemas/AttSchema");
const { PoolSessions } = require("./SwimmingPool");
const { StudioSessions } = require("./Studio");
const { FitnessRoomSessions } = require("./FitnessRoom");
const { SquashCourt1Sessions } = require("./SquashCourt1");
const { SquashCourt2Sessions } = require("./SquashCourt2");
const { SportsHallSessions } = require("./SportsHall");
const { ClimbingWallSessions } = require("./ClimbingWall");
const {
  Activities,
  Facilities,
} = require("../Models/ActivitiesAndFacilities.");

// POST METHOD: used to create new session: Authentication YES
const CreateSession = async (req, res) => {
  try {
    // Destruct email from request body
    const { Email } = req.body;
    // Check if there is a syntax error within the session object
    const { error } = SessionSchema.validate(req.body);

    // If error return response
    if (error)
      return res.status(400).json({
        message: error.details[0].message.replace(/"/g, ""),
        type: "error",
      });
    //check if email exists
    const customer = await Customer.findOne({ Email }).select("Email");
    if (!customer)
      return res.status(400).json({
        message: "Invalid Email",
        type: "error",
      });
    // Convert to lower case
    const act = req.body.Activity.toLowerCase();
    const fac = req.body.Facility.toLowerCase();
    console.log(req.body);
    // Check if they exist in the database
    if (!(Activities.includes(act) && Facilities.find((e) => e.Name == fac)))
      return res.status(400).json({
        message: "Activity or facility does not exit",
        type: "error",
      });
    const { data } = await GetCapacities(req, res);
    if (data.count <= 0)
      return res
        .status(200)
        .json({ message: "Fully Booked for that time slot", type: "war" });
    // console.log(data.count);
    req.body.Activity = req.body.Activity.toLowerCase();
    req.body.Facility = req.body.Facility.toLowerCase();
    const newSession = new Session(req.body);

    // Save the new session to the database

    await newSession.save();
    // Return success message to customer
    res.status(200).json({ message: "Session Created", type: "Success" });
  } catch (error) {
    // Return if there is a server error
    console.log(error.message);
    res.status(500).json({ message: error.message, type: "error" });
  }
};

const EditSession = async (req, res) => {
  // Check if there is a customer object
  const { session } = req.body;
  if (!session)
    return res
      .status(400)
      .json({ message: "Not sufficient attributes", type: "error" });

  // Check if there is syntax error
  const { error } = SessionSchemaPut.validate(req.body.session);

  // Return if there is a syntax error
  if (error) {
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });
  }
  try {
    req.body.Date = req.body.session.Date;
    req.body.Facility = req.body.session.Facility;
    const { data } = await GetCapacities(req, res);
    if (data.count <= 0)
      return res
        .status(200)
        .json({ message: "Fully Booked for that time slot", type: "war" });
    // Update the database
    const sesh = await Session.findOneAndUpdate({ _id: session._id }, session);

    if (!sesh)
      return res.status(400).json({
        message: "couldn't find session",
        type: "error",
      });

    // Return to customer with success message
    res.status(200).json({ message: "Session Updated", type: "success" });
  } catch (error) {
    // Return with error message if there is server error
    res.status(500).json({ message: error.message, type: "error" });
  }
};

const CheckSessionExits = async (req, res) => {
  try {
    let dateTime = req.body.Date + " " + req.body.Time.slice(0, 3) + "00";
    let session = await Session.find({
      Email: req.body.Email,
      Date: dateTime,
      Status: "pending",
    });
    if (session.length <= 0) {
      const hour = dateTime.slice(11, 13) - 1;
      dateTime = dateTime.slice(0, 10) + ` ${hour < 10 ? "0" : ""}${hour}:00`;
      session = await Session.find({
        Email: req.body.Email,
        Date: dateTime,
        Status: "pending",
      });
    }
    return res
      .status(200)
      .json({ message: session.length > 0 ? "Exits" : "!Exit", type: "error" });
  } catch (error) {
    // Return if there is a server error
    res.status(500).json({ message: error.message, type: "error" });
  }
};

const CheckTeamEvents = async (req, res) => {
  if (!req.body.Date || !req.body.Facility)
    return req
      .status(404)
      .json({ message: "No Details provided", type: "error" });
  try {
    let dateTime = "";
    if (req.body.Time) {
      dateTime = req.body.Date + " " + req.body.Time.slice(0, 3) + "00";
    }
    let date = req.body.Time ? dateTime : req.body.Date;
    let session = await Session.find({
      Date: date,
      Facility: req.body.Facility,
      Activity: "team events",
    });
    if (session.length <= 0) {
      const hour = date.slice(11, 13) - 1;
      date = date.slice(0, 10) + ` ${hour < 10 ? "0" : ""}${hour}:00`;
      session = await Session.find({
        Date: date,
        Facility: req.body.Facility,
        Activity: "team events",
      });
    }
    return res.status(200).json({
      message: session.length > 0 ? "Exits" : "!Exit",
      type: "success",
    });
  } catch (error) {
    // Return if there is a server error
    res.status(500).json({ message: error.message, type: "error" });
  }
};

const GetSessions = async (req, res) => {
  // Destruct email from request body
  const Email = req.header("Email");

  // Check if there is a syntax error
  const { error } = EmailSchema.validate({ Email });
  // Return if there is an error
  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });

  try {
    // Get sessions from database
    const sessions = await Session.find({ Email, Status: "pending" })
      .select("-Email")
      .select("-__v");
    const currentSessions = sessions.filter(async (item) => {
      const sessionDate = new Date(item.Date);
      const currentDate = new Date();
      if (sessionDate.getTime() >= currentDate.getTime()) return item;
      else await Session.findByIdAndUpdate(item._id, { Status: "passed" });
    });
    // Return sessions to the customer
    res.status(200).json({ data: currentSessions, type: "success" });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: error.message, type: "error" });
  }
};

const DeleteSession = async (req, res) => {
  // Destruct id from request body
  const { _id, Email } = req.body;

  // check for schema error
  const { error } = SessionSchemaPut.validate(req.body);

  if (error)
    return res.status(400).json({
      message: error.details[0].message.replace(/"/g, ""),
      type: "error",
    });

  try {
    // Update database and set Status to canceled
    const session = await Session.findByIdAndUpdate(_id, {
      Status: "canceled",
    });
    // Check if the session exists
    if (!session)
      return res
        .status(400)
        .json({ message: "Session Not Found", type: "error" });

    // Return success response
    res.status(200).json({ message: "Session Canceled", type: "success" });
  } catch (error) {
    // Return error response
    res.status(500).json({ message: "Session Not Found", type: "Error" });
  }
};

const GetCapacities = async (req, res) => {
  try {
    const BodyDate = req.body.Date || req.header("time");
    const BodyFacility = req.body.Facility || req.header("Facility");
    if (!BodyDate || !BodyFacility) {
      res.status(400).json({ message: "Missing Details", type: "error" });
      return;
    }
    if (
      new Date(BodyDate) < new Date() &&
      new Date(BodyDate).toISOString().slice(0, 10) !==
        new Date().toISOString().slice(0, 10)
    ) {
      res.status(400).json({ message: "Invalid Date", type: "error" });
      return;
    }
    if (BodyDate.length >= 15) {
      const date = new Date(BodyDate);
      date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
      const currentDate = new Date();
      currentDate.setTime(
        currentDate.getTime() - currentDate.getTimezoneOffset() * 60 * 1000
      );
      // Checks if date is valid
      const isValid =
        date.getFullYear() >= currentDate.getFullYear() &&
        date.getMonth() >= currentDate.getMonth() &&
        Number(date.toISOString().slice(11, 13)) >= 8 &&
        Number(date.toISOString().slice(11, 13)) <= 22;
      if (!isValid) {
        res
          .status(400)
          .json({ message: "Invalid Date and/or time", type: "error" });
        return;
      }
    }
    // This function retrieves the capacity left at a give date or time
    // await CompareTimes(req);
    const capacity = Facilities.find((e) => e.Name == BodyFacility).Capacity;
    // Check if date or time is given
    if (BodyDate.length >= 15) {
      // Find all sessions at that time slot
      let sessions = await Session.find({
        Date: BodyDate,
        Facility: BodyFacility,
        Status: "pending",
      }).countDocuments();
      // convert to date and time object
      const d = new Date(BodyDate);
      d.setTime(d.getTime() - d.getTimezoneOffset() * 60 * 1000);
      // Return capacity and time slot to customer
      return {
        data: {
          count: capacity - sessions,
          timeSlot: d,
        },
        type: "success",
      };
      // if only the date is provided
    } else if (BodyDate.length >= 10 && BodyDate.length < 15) {
      let limit = 23;
      if (BodyFacility === "swimming pool") limit = 21;
      let Capacities = [];
      // Loop around the time slots during the day
      const date = new Date(BodyDate);
      date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
      const currentDate = new Date();
      currentDate.setTime(
        currentDate.getTime() - currentDate.getTimezoneOffset() * 60 * 1000
      );
      let initial = 8;
      if (
        currentDate.toISOString().slice(0, 10) ===
        date.toISOString().slice(0, 10)
      ) {
        const hour = Number(currentDate.toISOString().slice(11, 13));
        if (hour > 8 && hour < limit) {
          initial = hour;
        }
      }
      for (let j = initial; j < limit; j++) {
        // Format time slot based on index
        let date = BodyDate;
        date = date + ` ${j < 10 ? "0" : ""}${j}:00`;
        // find the capacity on each time slot
        let sessions = await Session.find({
          Date: date,
          Facility: BodyFacility,
          Status: "pending",
        }).countDocuments();
        const d = new Date(date);
        d.setTime(d.getTime() - d.getTimezoneOffset() * 60 * 1000);
        // add all capacities to an array
        Capacities.push({
          count: capacity - sessions,
          timeSlot: d,
        });
      }
      // return to customer
      return { data: Capacities, type: "success" };
    }
    // return error if date was invalid
    return { message: "invalid time slot", type: "error" };
  } catch (error) {
    console.log(error.message);
    return { message: error.message, type: "error" };
  }
};

// const CompareTimes = async (req) => {
//   // Get Date and Facility parameters
//   const BodyDate = req.body.Date || req.header("time");
//   const BodyFacility = req.body.Facility || req.header("Facility");
//   console.log(BodyDate, BodyFacility);
//   // return;
//   if (BodyDate.length >= 15) {
//     // Find all sessions at that time slot
//     let session = await Session.find({
//       Date: req.body.Date,
//       Facility: req.body.Facility,
//       Status: "pending",
//     }).select("_id");
//     // convert to date and time object
//     const d = new Date(req.body.Date);
//     const now = new Date();
//     if (now > d)
//       for (let i = 0; i < session.length; i++)
//         await Session.findByIdAndUpdate(session[i]._id, { Status: "passed" });

//     // if only the date is provided
//   } else if (req.body.Date.length > 9 && req.body.Date.length < 15) {
//     // Loop around the time slots during the day
//     for (let j = 8; j < 21; j++) {
//       // Format time slot based on index
//       let date = req.body.Date;
//       date = date + ` ${j}:00`;
//       // find the capacity on each time slot
//       let sessions = await Session.find({
//         Date: date,
//         Facility: req.body.Facility,
//         Status: "pending",
//       }).select("_id");
//       const now = new Date();
//       const d = new Date(date);
//       // compare date and times to see if the sessions is passed its time
//       if (now > d) {
//         for (let i = 0; i < sessions.length; i++) {
//           await Session.findByIdAndUpdate(sessions[i]._id, {
//             Status: "passed",
//           });
//         }
//       }
//     }
//   }
// };

const GetCapacitiesRoute = async (req, res) => {
  const data = await GetCapacities(req, res);
  res.status(200).json(data);
};

{
  // POST: used to create a new session by a customer or an employee: Takes a session object
  router.post("/customer", CustomerAuthentication, CreateSession);
  router.post("/employee", EmployeeAuthentication, CreateSession);

  router.post(
    "/customer/check-session",
    CustomerAuthentication,
    CheckSessionExits
  );
  router.post(
    "/employee/check-session",
    EmployeeAuthentication,
    CheckSessionExits
  );

  // PUT: used to edit a session: Takes a session object
  router.put("/customer", CustomerAuthentication, EditSession);
  router.put("/employee", EmployeeAuthentication, EditSession);

  // GET: used to retrieve all sessions for a certain customer
  router.get("/customer", CustomerAuthentication, GetSessions);
  router.get("/employee", EmployeeAuthentication, GetSessions);

  // DELETE: used to cancel a session
  router.delete("/customer", CustomerAuthentication, DeleteSession);
  router.delete("/Employee", EmployeeAuthentication, DeleteSession);

  // GET: used to get all pool sessions
  router.get("/customer/pool", CustomerAuthentication, PoolSessions);
  router.get("/employee/pool", EmployeeAuthentication, PoolSessions);

  // GET: used to get all studio sessions
  router.get("/customer/studio", CustomerAuthentication, StudioSessions);
  router.get("/employee/studio", EmployeeAuthentication, StudioSessions);

  // GET: used to get all climbing-wall sessions
  router.get(
    "/customer/climbing-wall",
    CustomerAuthentication,
    ClimbingWallSessions
  );
  router.get(
    "/employee/climbing-wall",
    EmployeeAuthentication,
    ClimbingWallSessions
  );

  // GET: used to get all squash court 1 sessions
  router.get(
    "/customer/squash-court1",
    CustomerAuthentication,
    SquashCourt1Sessions
  );
  router.get(
    "/employee/squash-court1",
    EmployeeAuthentication,
    SquashCourt1Sessions
  );
  // GET: used to get all squash court 2 sessions
  router.get(
    "/customer/squash-court2",
    CustomerAuthentication,
    SquashCourt2Sessions
  );
  router.get(
    "/employee/squash-court2",
    EmployeeAuthentication,
    SquashCourt2Sessions
  );

  // GET: used to get all fitness room sessions
  router.get(
    "/customer/fitness-room",
    CustomerAuthentication,
    FitnessRoomSessions
  );
  router.get(
    "/employee/fitness-room",
    EmployeeAuthentication,
    FitnessRoomSessions
  );

  // GET: used to get all sports hall sessions
  router.get(
    "/customer/sports-hall",
    CustomerAuthentication,
    SportsHallSessions
  );
  router.get(
    "/employee/sports-hall",
    EmployeeAuthentication,
    SportsHallSessions
  );
  // GET: used to get capacities for each time slot
  router.get(
    "/customer/all-sessions",
    CustomerAuthentication,
    GetCapacitiesRoute
  );
  router.get(
    "/employee/all-sessions",
    EmployeeAuthentication,
    GetCapacitiesRoute
  );

  router.post("/customer/team-events", CustomerAuthentication, CheckTeamEvents);
  router.post("/employee/team-events", EmployeeAuthentication, CheckTeamEvents);
}
module.exports = router;
