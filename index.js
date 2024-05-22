import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

//Database
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();
console.log(__dirname);

//Express
const app = express();

app.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
app.use(express.json());

app.use(cookieParser());

//API Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// Serve static files from the build folder
// const frontendBuildPath = path.resolve(__dirname, "..", "frontend", "dist"); // Adjusted path
// app.use(express.static(frontendBuildPath));

// // Serve index.html for any other routes
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(frontendBuildPath, "index.html")); // Adjusted path
// });



app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
