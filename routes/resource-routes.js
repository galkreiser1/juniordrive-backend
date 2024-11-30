const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resource-controller");
const upload = require("../config/s3Config");

// Regular resources (no file)
router.post("/", resourceController.createResource);

// Resources with file upload
router.post(
  "/with-file",
  upload.single("file"), // 'file' matches the field name from your form
  resourceController.createResourceWithFile
);

router.get("/", resourceController.getResources);

module.exports = router;
