const express = require("express");
const router = express.Router();
router.use(express.json());
const JWT = require("jsonwebtoken");

router.post("/", (req, res) => {
  // If there is no token return error
  if (!req.body.Token || !req.body.Person)
    return res.json({
      message: "Missing Details",
      type: "error",
    });
  let TOKEN_SECRET;
  if (req.body.Person == "Customer") TOKEN_SECRET = process.env.TOKEN_SECRET;
  else if (req.body.Person == "Employee")
    TOKEN_SECRET = process.env.TOKEN_SECRET_3;
  else if (req.body.Person == "Manager")
    TOKEN_SECRET = process.env.TOKEN_SECRET_2;
  try {
    // Check if the token is valid
    const isActive = JWT.verify(req.body.Token, TOKEN_SECRET);
    res.json({ message: "jwt is valid", id: isActive.id, type: "success" });
  } catch (error) {
    // If  error return error
    res.json({ message: error.message, type: "error" });
  }
});

module.exports = router;
