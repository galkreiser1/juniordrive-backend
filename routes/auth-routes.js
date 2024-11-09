const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth-controller");

router.post("/login", authController.loginController);
router.post("/logout", authController.logoutController);
router.get("/status", authController.checkAuthStatus);

module.exports = router;
