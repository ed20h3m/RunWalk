const express = require("express");
const router = express.Router();
router.use(express.json());
const {
  Activities,
  Facilities,
} = require("../Models/ActivitiesAndFacilities.");

const Customer = require("../Models/Customer");
const Session = require("../Models/Session");

const ClimbingWall = require("../Models/ClimbingWall");
const FitnessRoom = require("../Models/FitnessRoom");
const SportsHall = require("../Models/SportsHall");
const SquashCourt1 = require("../Models/SquashCourt1");
const SquashCourt2 = require("../Models/SquashCourt2");
const Studio = require("../Models/Studio");
const SwimmingPool = require("../Models/SwimmingPool");

const ManagerAuthentication = require("../Middleware/ManagerAuthentication");
const stripe = require("stripe")(
  "sk_test_51MlBZHFi0ADzfbva1UjwNVVstqe7Jpqh5eaibsM92PmKpBEpUfP81cpAySUDLA4TvyAzjhqiI2qf1kzBeSJgcEiX00OW7ph683"
);

const GetBookedSessions = async (req, res) => {
  const { Date1, Date2 } = req.body;
  if (!Date1 || !Date2)
    return res
      .status(404)
      .json({ message: "Details not found", type: "error" });

  let Sessions;
  let date = new Date(Date1);
  const noOfDays = NoDays(Date1, Date2);
  // console.log(noOfDays);
  let data = [];
  for (let i = 0; i < Facilities.length; i++) {
    // let counter = [];
    // for (let j = 0; j < noOfDays; j++) {
    //   const d = new Date(date.getTime() + j * 86400000)
    //     .toISOString()
    //     .slice(0, 10);
    //   // date.setDate(date.getDate() + j);
    //   Sessions = await Session.find({
    //     created_at: {
    //       $gte: d + " 00:00",
    //       $lte: d + " 23:00",
    //     },
    //     Facility: Facilities[i].Name,
    //   }).countDocuments();
    //   counter[j] = Sessions;
    // }
    const filter = {
      created_at: {
        $gte: new Date(`${Date1} 00:00`),
        $lte: new Date(`${Date2} 23:00`),
      },
      Facility: Facilities[i].Name,
    };
    Sessions = await Session.find(filter).countDocuments();
    // console.log("\n");
    data[i] = { Facility: Facilities[i].Name, count: Sessions };
  }
  res.status(200).json({ data: data, type: "success" });
};

const GetFacilityActivity = async (req, res) => {
  let { Date1, Date2, Facility } = req.body;
  Date1 = Date1 + " 00:00";
  Date2 = Date2 + " 23:00";
  if (!Date1 || !Date2 || !Facility)
    return res
      .status(404)
      .json({ message: "Details not found", type: "error" });

  let Sessions;
  let date = new Date(Date1);
  const noOfDays = NoDays(Date1, Date2);
  let data = [];
  const fac = Facilities.find((item) => item.Name === Facility);
  for (let i = 0; i < fac.Activities.length; i++) {
    let counter = [];
    for (let j = 0; j < noOfDays; j++) {
      const d = new Date(date.getTime() + j * 86400000)
        .toISOString()
        .slice(0, 10);
      Sessions = await Session.find({
        created_at: {
          $gte: d + " 00:00",
          $lte: d + " 23:00",
        },
        Facility: Facility,
        Activity: fac.Activities[i],
      }).countDocuments();
      counter[j] = Sessions;
    }
    data[i] = { Activity: Activities[i], count: counter };
  }
  res.status(200).json({ data: data, type: "success" });
};

const TotalProfitMade = async (req, res) => {
  let { Date1, Date2 } = req.body;
  let Total = 0;
  if (!Date1 || !Date2)
    return res
      .status(404)
      .json({ message: "Details not found", type: "error" });
  const Sessions = await Session.find({
    created_at: {
      $gte: new Date(`${Date1} 00:00`),
      $lte: new Date(`${Date2} 23:00`),
    },
  }).select("Price");
  Total = Sessions.reduce((a, b) => a + b.Price, 0);
  const subscriptions = await stripe.subscriptions.list({
    status: "all",
  });
  for (let i = 0; i < subscriptions.data.length; i++) {
    const billingStart = new Date(
      subscriptions.data[i].current_period_start * 1000
    ).getTime();
    if (
      new Date(Date1).getTime() <= billingStart &&
      new Date(Date2).getTime() >= billingStart
    ) {
      Total += subscriptions.data[i].plan.amount / 100;
    }
  }
  res.status(200).json({ data: Total, type: "success" });
};

const TotalProfitMadePerFacility = async (req, res) => {
  let { Date1, Date2, Facility } = req.body;
  if (!Date1 || !Date2 || !Facility)
    return res
      .status(404)
      .json({ message: "Details not found", type: "error" });
  const Sessions = await Session.find({
    created_at: {
      $gte: new Date(`${Date1} 00:00`),
      $lte: new Date(`${Date2} 23:00`),
    },
    Facility: Facility,
  }).select("Price");
  const Total = Sessions.reduce((a, b) => a + b.Price, 0);
  res.status(200).json({ data: Total, type: "success" });
};

const TotalProfitMadeAllFacilities = async (req, res) => {
  let { Date1, Date2 } = req.body;
  if (!Date1 || !Date2)
    return res
      .status(404)
      .json({ message: "Details not found", type: "error" });
  const data = [];
  for (let i = 0; i < Facilities.length; i++) {
    const Sessions = await Session.find({
      created_at: {
        $gte: new Date(`${Date1} 00:00`),
        $lte: new Date(`${Date2} 23:00`),
      },
      Facility: Facilities[i].Name,
    }).select("Price");
    const Total = Sessions.reduce((a, b) => a + b.Price, 0);
    data[i] = { Facility: Facilities[i].Name, Total: Total };
  }
  res.status(200).json({ data: data, type: "success" });
};

const TotalProfitMadeAllActivities = async (req, res) => {
  let { Date1, Date2 } = req.body;
  if (!Date1 || !Date2)
    return res
      .status(404)
      .json({ message: "Details not found", type: "error" });
  const data = [];
  for (let i = 0; i < Activities.length; i++) {
    const Sessions = await Session.find({
      created_at: {
        $gte: new Date(`${Date1} 00:00`),
        $lte: new Date(`${Date2} 23:00`),
      },
      Activity: Activities[i],
    }).select("Price");
    const Total = Sessions.reduce((a, b) => a + b.Price, 0);
    data[i] = { Activity: Activities[i], Total: Total };
  }
  res.status(200).json({ data: data, type: "success" });
};

const TotalProfitMadePerActivity = async (req, res) => {
  let { Date1, Date2, Activity } = req.body;
  if (!Date1 || !Date2 || !Activity)
    return res
      .status(404)
      .json({ message: "Details not found", type: "error" });
  const Sessions = await Session.find({
    created_at: {
      $gte: new Date(`${Date1} 00:00`),
      $lte: new Date(`${Date2} 23:00`),
    },
    Activity: Activity,
  }).select("Price");
  const Total = Sessions.reduce((a, b) => a + b.Price, 0);
  res.status(200).json({ data: Total, type: "success" });
};

const TotalProfitPerFacilityPerActivity = async (req, res) => {
  let { Date1, Date2, Activity, Facility } = req.body;
  if (!Date1 || !Date2 || !Activity || !Facility)
    return res
      .status(404)
      .json({ message: "Details not found", type: "error" });
  const Sessions = await Session.find({
    created_at: {
      $gte: new Date(`${Date1} 00:00`),
      $lte: new Date(`${Date2} 23:00`),
    },
    Activity: Activity,
    Facility: Facility,
  }).select("Price");
  const Total = Sessions.reduce((a, b) => a + b.Price, 0);
  res.status(200).json({ data: Total, type: "success" });
};

const GetNumberOfCustomers = async (req, res) => {
  let { Date1, Date2, isMember } = req.body;
  if (!Date1 || !Date2)
    return res
      .status(404)
      .json({ message: "Details not found", type: "error" });
  const filter = {
    created_at: {
      $gte: new Date(`${Date1} 00:00`),
      $lte: new Date(`${Date2} 23:00`),
    },
    isMember: isMember,
  };
  if (isMember === null || isMember === undefined) delete filter.isMember;
  const customerNo = await Customer.find(filter).countDocuments();
  res.status(200).json({ data: customerNo, type: "success" });
};

const NoDays = (Date1, Date2) => {
  let date1 = new Date(Date1);
  let date2 = new Date(Date2);
  let difference = date1.getTime() - date2.getTime();
  let TotalDays = Math.abs(Math.ceil(difference / (1000 * 3600 * 24)));
  return TotalDays;
};

const GetAllFacilitiesInfo = async (req, res) => {
  try {
    let Facilities = [];
    const arr = [
      ClimbingWall,
      FitnessRoom,
      SportsHall,
      SquashCourt1,
      SquashCourt2,
      Studio,
      SwimmingPool,
    ];
    for (let i = 0; i < arr.length; i++) {
      Facilities[i] = await arr[i].findOne();
    }
    res.status(200).json({ data: Facilities, type: "success" });
  } catch (error) {
    res.status(500).json({ message: error.message, type: "error" });
  }
};

router.post("/get-session", ManagerAuthentication, GetBookedSessions);
router.post(
  "/get-facility-activity",
  ManagerAuthentication,
  GetFacilityActivity
);
router.post("/total-profit", ManagerAuthentication, TotalProfitMade);
router.post(
  "/total-profit-made-per-facility",
  ManagerAuthentication,
  TotalProfitMadePerFacility
);
router.post(
  "/total-profit-made-all-facility",
  ManagerAuthentication,
  TotalProfitMadeAllFacilities
);
router.post(
  "/total-profit-made-all-activity",
  ManagerAuthentication,
  TotalProfitMadeAllActivities
);
router.post(
  "/total-profit-made-per-activity",
  ManagerAuthentication,
  TotalProfitMadePerActivity
);
router.post(
  "/get-number-of-customers",
  ManagerAuthentication,
  GetNumberOfCustomers
);
router.post(
  "/total-profit-made-per-facility-per-activity",
  ManagerAuthentication,
  TotalProfitPerFacilityPerActivity
);
router.get(
  "/get-all-facility-info",
  ManagerAuthentication,
  GetAllFacilitiesInfo
);

module.exports = router;
