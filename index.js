const HttpError = require("./models/http-error");

const express = require("express");

const refererRouter = require("./routes/referer-routes");
const companyRouter = require("./routes/company-routes");
const authRouter = require("./routes/auth-routes");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const app = express();

// Enable CORS with credentials
const corsOptions = {
  origin: "http://localhost:5173", // Update this with your frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/api/referers", refererRouter);
app.use("/api/company", companyRouter);
app.use("/api/auth", authRouter);

app.use((req, res, next) => {
  next(new HttpError("Could not find route", 404));
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An Unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://gal:uoJQAh0lN6M2JLFv@cluster0.3dd5l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Starting Server...");
    console.log("Successfully connected to DB!");
    console.log("Listening on port 5000...");
    app.listen(5000);
  })
  .catch((err) => {
    console.log("Error connecting to DB", err.message);
  });
