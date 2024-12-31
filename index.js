require("dotenv").config();
const HttpError = require("./models/http-error");

const express = require("express");

const refererRouter = require("./routes/referer-routes");
const companyRouter = require("./routes/company-routes");
const authRouter = require("./routes/auth-routes");
const resourceRouter = require("./routes/resource-routes");

const { apiLimiter } = require("./middleware/middleware");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Accept", "Cookie"],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/api/", apiLimiter);

app.use("/api/referers", refererRouter);
app.use("/api/company", companyRouter);
app.use("/api/auth", authRouter);
app.use("/api/resources", resourceRouter);

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

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Successfully connected to DB!");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to DB:", err.message);
    process.exit(1);
  });
