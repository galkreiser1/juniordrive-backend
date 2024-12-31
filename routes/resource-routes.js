const express = require("express");
const router = express.Router();
const resourceController = require("../controllers/resource-controller");
const upload = require("../config/s3Config");
const {
  authMiddleware,
  uploadLimitMiddleware,
} = require("../middleware/middleware");

// Regular resources (no file)
router.post("/", authMiddleware, resourceController.createResource);

// Resources with file upload
router.post(
  "/with-file",
  authMiddleware,
  uploadLimitMiddleware,
  upload.single("file"), // 'file' matches the field name from your form
  resourceController.createResourceWithFile
);

router.get("/", resourceController.getResources);

module.exports = router;
