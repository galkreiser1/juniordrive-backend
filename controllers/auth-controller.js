const HttpError = require("../models/http-error");
const { OAuth2Client } = require("google-auth-library");

const clientID =
  "1021369967990-lqngfoqb1eooonp28sl65m4sre8dcsf8.apps.googleusercontent.com";
const client = new OAuth2Client(clientID);

const isProduction = process.env.NODE_ENV === "production";

const loginController = async (req, res, next) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientID,
    });

    const payload = ticket.getPayload();

    // Set cookie with proper options
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
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
  res.cookie("auth_token", "", {
    httpOnly: true,
    secure: isProduction,
    maxAge: 0,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const checkAuthStatus = async (req, res) => {
  try {
    const token = req.cookies.auth_token;
    console.log("token: ", token);

    if (!token) {
      return res.status(200).json({ isAuthenticated: false });
    }

    // Verify the token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: clientID,
    });

    const payload = ticket.getPayload();

    res.status(200).json({
      isAuthenticated: true,
      user: {
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      },
    });
  } catch (error) {
    res.status(200).json({ isAuthenticated: false });
  }
};

exports.loginController = loginController;
exports.logoutController = logoutController;
exports.checkAuthStatus = checkAuthStatus;
