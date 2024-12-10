const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const authMiddleware = (req, res, next) => {
  console.log("Hitting middleware, token:", req.cookies.auth_token);
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ error: "Must be logged in." });
    }

    next();
  } catch (err) {
    return next(new HttpError("Authentication failed", 401));
  }
};

module.exports = authMiddleware;
