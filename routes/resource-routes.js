const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resource-controller");

router.get("/", resourceController.getResources);
router.post("/", resourceController.createResource);

module.exports = router;
