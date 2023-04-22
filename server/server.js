// This is the server of the application
// This is where the app starts executing

// import functions required
const express = require("express");
const DatabaseString = require("./database");
const server = express();

// Call database function to start the database
DatabaseString();

// Customer CRUD and LOGIN
server.use("/customers", require("./routes/Customers"));
server.use("/customer/login", require("./routes/CustomerLogin"));

// Session CRUD
server.use("/sessions", require("./routes/Sessions"));

// Manager CRUD and LOGIN
server.use("/manager/login", require("./routes/ManagerLogin"));
server.use("/manager", require("./routes/Manager"));

// Employee CRUD
server.use("/employee", require("./routes/Employee"));
server.use("/employee/login", require("./routes/EmployeeLogin"));

// Facility Management
const { PoolRouter } = require("./routes/SwimmingPool");
server.use("/swimming-pool/management", PoolRouter);

// Studio Management
const { StudioRouter } = require("./routes/Studio");
server.use("/studio/management", StudioRouter);

// climbing-wall Management
const { ClimbingWallRouter } = require("./routes/ClimbingWall");
server.use("/climbing-wall/management", ClimbingWallRouter);

// Fitness-Room Management
const { FitnessRoomRouter } = require("./routes/FitnessRoom");
server.use("/fitness-room/management", FitnessRoomRouter);

// squash-court-1 Management
const { SquashCourt1Router } = require("./routes/SquashCourt1");
server.use("/squash-court1/management", SquashCourt1Router);

// squash-court-2 Management
const { SquashCourt2Router } = require("./routes/SquashCourt2");
server.use("/squash-court2/management", SquashCourt2Router);

// sport-hall Management
const { SportsHallRouter } = require("./routes/SportsHall");
server.use("/sports-hall/management", SportsHallRouter);

// make payment
server.use("/payment", require("./routes/stripe"));

// check json web token
server.use("/check-jwt", require("./routes/CheckJWT"));

// check json web token
server.use("/email", require("./routes/Email"));

// reset password
server.use("/reset-password", require("./routes/ResetPassword"));

// Create subscription
server.use("/subscription", require("./routes/stripeSub"));

// Create a transaction
server.use("/transactions", require("./routes/Transactions"));

// Get sports centre info
server.use("/info", require("./routes/Info"));

// Get sports centre info
server.use("/stats", require("./routes/Stats"));

module.exports = server;
