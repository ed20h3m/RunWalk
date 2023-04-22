const app = require("./server");

// Set port number
const PORT = process.env.PORT || 5000;

// Start the server to listen for request
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
