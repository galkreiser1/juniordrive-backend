const HttpError = require("../models/http-error");
const Resource = require("../models/resource");
const { resourceSchema } = require("../validators/resource-validator");

const getResources = async (req, res, next) => {
  try {
    const resources = await Resource.find({});
    res.status(200).json({ resources });
  } catch (err) {
    return next(
      new HttpError("Error fetching resources, please try again", 500)
    );
  }
};

const createResource = async (req, res, next) => {
  const { error } = resourceSchema.validate(req.body);
  if (error) {
    return next(new HttpError(error.details[0].message, 400));
  }

  const { name, type, description, link } = req.body;

  try {
    const newResource = new Resource({
      name,
      type,
      description: description || "",
      link,
    });

    await newResource.save();
    res.status(201).json({ resource: newResource });
  } catch (e) {
    return next(
      new HttpError("Error creating resource, please try again", 500)
    );
  }
};

exports.getResources = getResources;
exports.createResource = createResource;
