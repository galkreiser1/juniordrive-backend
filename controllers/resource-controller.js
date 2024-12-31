const HttpError = require("../models/http-error");
const Resource = require("../models/resource");
const { resourceSchema } = require("../validators/resource-validator");

const getResources = async (req, res, next) => {
  try {
    const resources = await Resource.find({
      $or: [{ isApproved: true }, { isApproved: { $exists: false } }],
    });
    res.status(200).json({ resources });
  } catch (err) {
    return next(
      new HttpError("Error fetching resources, please try again", 500)
    );
  }
};

const getUserUploadCount = async (req) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const userUploads = await Resource.countDocuments({
    createdBy: req.userData.email,
    createdAt: { $gte: today },
  });
};

const createResource = async (req, res, next) => {
  const { error } = resourceSchema.validate(req.body);
  if (error) {
    return next(new HttpError(error.details[0].message, 400));
  }

  if (getUserUploadCount(req) >= 5) {
    return next(new HttpError("Dailed upload limit reached", 429));
  }

  const { name, type, description, link } = req.body;

  try {
    const newResource = new Resource({
      name,
      type,
      description: description || "",
      link,
      isApproved: false,
      createdBy: req.userData.email,
    });

    await newResource.save();
    res.status(201).json({ resource: newResource });
  } catch (e) {
    return next(
      new HttpError("Error creating resource, please try again", 500)
    );
  }
};

// New function to handle file uploads
const createResourceWithFile = async (req, res, next) => {
  try {
    // req.file is available because of multer
    if (!req.file) {
      return next(new HttpError("No file uploaded", 400));
    }

    if (getUserUploadCount(req) >= 5) {
      return next(new HttpError("Dailed upload limit reached", 429));
    }

    const { name, type, description } = req.body;

    const newResource = new Resource({
      name,
      type,
      description: description || "",
      fileUrl: req.file.location, // S3 url of the uploaded file
      fileName: req.file.originalname,
      isApproved: false,
      createdBy: req.userData.email,
    });

    await newResource.save();
    res.status(201).json({ resource: newResource });
  } catch (e) {
    console.error("File upload error:", e);
    return next(new HttpError("Error creating resource with file", 500));
  }
};

exports.getResources = getResources;
exports.createResource = createResource;
exports.createResourceWithFile = createResourceWithFile;
