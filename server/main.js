const app = require("./server");

// Set port number
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV === "production") {
  app.use(express.static("./client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
// Start the server to listen for request
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
