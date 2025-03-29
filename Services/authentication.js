// Services/authentication.js
const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
    fullname: user.fullname,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
}

function ValidateTokenToUse(token) {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
}

module.exports = {
  createTokenForUser,
  ValidateTokenToUse,
};
