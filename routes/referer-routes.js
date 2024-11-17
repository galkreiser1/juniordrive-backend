const express = require("express");

const router = express.Router();

const refererControllers = require("../controllers/referer-controller.js");

router.get("/:company", refererControllers.getReferers);
router.post("/", refererControllers.createReferer);
router.delete("/:email", refererControllers.deleteReferer);

module.exports = router;
