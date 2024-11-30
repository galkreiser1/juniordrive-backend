const HttpError = require("../models/http-error");
const { createCompanySchema } = require("../validators/company-validators");
const Company = require("../models/company");
const utils = require("../utils/utils");

const createCompany = async (req, res, next) => {
  const { error } = createCompanySchema.validate(req.body);
  if (error) {
    return next(new HttpError(error.details[0].message, 400));
  }

  let { name } = req.body;
  name = utils.capitalizeCompanyName(name);

  const newCompany = new Company({
    name,
  });

  try {
    let existingCompany = await Company.findOne({ name: company });
    if (!existingCompany) {
      const newCompany = new Company({ name: company });
      await newCompany.save();
    }

    res.status(201).json({ company: newCompany });
  } catch (e) {
    return next(
      new HttpError("Error creating new company, please try again", 500)
    );
  }
};

const getCompanies = async (req, res, next) => {
  const searchQuery = req.query.search || "";

  // Add pagination parameters
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  try {
    let query = {};

    // Only add search condition if there's a search query
    if (searchQuery) {
      query.name = { $regex: `^${searchQuery}`, $options: "i" };
    }

    const companies = await Company.find(query)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Company.countDocuments(query);

    res.status(200).json({
      companies,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    return next(
      new HttpError("Could not fetch companies, please try again", 500)
    );
  }
};

exports.createCompany = createCompany;
exports.getCompanies = getCompanies;
