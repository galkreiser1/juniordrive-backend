const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");
const rateLimit = require("express-rate-limit");

const uploadLimitMiddleware = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many uploads from this IP, please try again in an hour",
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
});

const authMiddleware = (req, res, next) => {
  try {
    console.log("=== Auth Middleware Debug ===");
    console.log("All Cookies:", req.cookies);
    console.log("Auth Token:", req.cookies.auth_token);
    console.log("Headers:", req.headers);
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ error: "Must be logged in." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { email: decodedToken.email };

    next();
  } catch (err) {
    return next(new HttpError("Authentication failed", 401));
  }
};

module.exports = { authMiddleware, uploadLimitMiddleware, apiLimiter };
