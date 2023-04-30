require("dotenv").config();
const path = require("path");
const app = require("./server");
const express = require("express");

// Set port number
app.use(express.static(path.join(__dirname, "build")));

// Set port number
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV === "production") {
  app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}
// Start the server to listen for request
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
