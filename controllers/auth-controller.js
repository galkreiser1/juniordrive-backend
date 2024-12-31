const HttpError = require("../models/http-error");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const clientID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(clientID);

const JWT_SECRET = process.env.JWT_SECRET;

const isProduction = process.env.NODE_ENV === "production";

const loginController = async (req, res, next) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientID,
    });

    const payload = ticket.getPayload();

    const sessionToken = jwt.sign(
      {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("auth_token", sessionToken, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
    });
  } catch (e) {
    console.error("Login error:", e);
    return next(new HttpError("Login failed", 400));
  }
};

const logoutController = (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    expires: new Date(0),
    domain: undefined,
  });

  res.status(200).json({ message: "Logged out successfully" });
};

const checkAuthStatus = async (req, res) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(200).json({ isAuthenticated: false });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    res.status(200).json({
      isAuthenticated: true,
      user: {
        email: decoded.email,
        name: decoded.name,
        picture: decoded.picture,
      },
    });
  } catch (error) {
    res.status(200).json({ isAuthenticated: false });
  }
};

exports.loginController = loginController;
exports.logoutController = logoutController;
exports.checkAuthStatus = checkAuthStatus;
