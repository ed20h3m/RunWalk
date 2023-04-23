//This is where the database starts and a connection is established
// import all required modules
const mongoose = require("mongoose");
require("dotenv").config();

//set the strictQuery option to true so unwanted data doesn't get stored in the .
mongoose.set("strictQuery", true);

//Function: initiates the database
const ConnectDataBase = () => {
  try {
    mongoose.connect(process.env.DatabaseString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database Connected !!!");
  } catch (err) {
    //Writes to the console if there is an error
    console.log(err.message);
  }
};
//Exports the Function to other modules to access
module.exports = ConnectDataBase;
