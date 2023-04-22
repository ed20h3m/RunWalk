const app = require("./server");
const path = require("path");
require("dotenv").config();
const express = require("express");

// Set port number
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "build")));

  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });

  // app.use(express.static("./build"));
  // app.get("*", (req, res) => {
  //   res.sendFile(path.resolve(__dirname, "server", "build", "index.html"));
  //   //
  // });
}
// Start the server to listen for request
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
