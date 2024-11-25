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
  // Get search query from URL parameters
  // example URL: /api/company?search=apple
  const searchQuery = req.query.search || "";

  // Add pagination parameters
  // example URL: /api/company?search=apple&page=1&limit=20
  const page = parseInt(req.query.page) || 1; // If no page specified, default to 1
  const limit = parseInt(req.query.limit) || 20; // Show 20 items per page by default

  try {
    let query = {};

    // Only add search condition if there's a search query
    if (searchQuery) {
      // $regex is MongoDB's way of using regular expressions
      // '^' means "starts with"
      // 'i' means case insensitive
      query.name = { $regex: `^${searchQuery}`, $options: "i" };
    }

    const companies = await Company.find(query)
      .limit(limit) // Limit how many documents to return
      .skip((page - 1) * limit); // Skip previous pages

    // Also get total count for pagination
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
