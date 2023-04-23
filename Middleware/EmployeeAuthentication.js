// Middleware function for to check employee authentication

// Import json web token
const JWT = require("jsonwebtoken");

// Authentication function
const EmployeeAuthentication = (req, res, next) => {
  // Store the token for the request header
  const Token = req.header("token");

  // If there is no token return error
  if (!Token)
    return res.json({
      message: "No permission to access this route without authentication",
      type: "error",
    });

  try {
    // Check if the token is valid
    const isActive = JWT.verify(Token, process.env.TOKEN_SECRET_3);
    req.id = isActive.id;
    // If token i valid move to the next block of code
    next();
  } catch (error) {
    // If  error return error
    res.json({ message: error.message, type: "error" });
  }
};

module.exports = EmployeeAuthentication;
