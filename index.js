// index.js
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB Connection Successful"))
  .catch((err) => console.error(err));

// Middleware to parse JSON and URL‑encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// app.use(
//   cors({
//     origin: "*", // or an array of allowed origins
//     credentials: true,
//   })
// );

// Serve static files (for image uploads)
app.use("/uploads", express.static(path.resolve("./public/uploads")));

// Import authentication middleware and routes
const { checkForAuthToken } = require("./middleware/authentication");
app.use(checkForAuthToken());

const userRoutes = require("./Routes/user");
const blogRoutes = require("./Routes/blog");

// API endpoints
app.use("/api/users", userRoutes);
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
