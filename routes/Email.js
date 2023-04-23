const express = require("express");
const router = express.Router();
router.use(express.json());
const JWT = require("jsonwebtoken");
const { SendEmail } = require("../Email");

router.post("/", (req, res) => {
  const { Email, items } = req.body;
  if (!Email)
    return res.status(404).json({ message: "Missing Email", type: "error" });
  if (!items)
    return res.status(404).json({ message: "Missing Items", type: "error" });
  SendEmail(Email, items);
  res.status(200).json({ message: "Confirmation Email Sent", type: "success" });
});

module.exports = router;
