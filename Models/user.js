// Models/user.js
const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../Services/authentication");

const UserSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    salt: { type: String },
    password: { type: String, required: true },
    profileImageURL: { type: String, default: "/uploads/default.jpg" },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
      .update(user.password)
      .digest("hex");
    user.salt = salt;
    user.password = hashedPassword;
    next();
  } catch (error) {
    console.error("Error in User pre-save:", error);
    next(error);
  }
});

UserSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const User = this;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    const providedHash = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");
    if (providedHash !== user.password) {
      throw new Error("Incorrect Password");
    }
    const token = createTokenForUser(user);
    return token;
  }
);

const User = model("user", UserSchema);
module.exports = User;
