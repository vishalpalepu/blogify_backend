// middleware/authentication.js
const { ValidateTokenToUse } = require("../Services/authentication");

function checkForAuthToken() {
  return (req, res, next) => {
    let token = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return next();
    }
    try {
      const payload = ValidateTokenToUse(token);
      req.user = payload;
    } catch (error) {
      console.error("Invalid token:", error.message);
    }
    next();
  };
}

module.exports = { checkForAuthToken };
