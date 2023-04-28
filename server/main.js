const app = require("./server");
const path = require("path");
require("dotenv").config();
const express = require("express");

app.use(express.static("../client/build"));

// Set port number
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
// Start the server to listen for request
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
