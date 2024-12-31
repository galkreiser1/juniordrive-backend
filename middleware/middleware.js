const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

const authMiddleware = (req, res, next) => {
  try {
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

module.exports = authMiddleware;
