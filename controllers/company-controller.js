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
  try {
    const companies = await Company.find({});
    res.status(200).json({ companies });
  } catch (e) {
    return next(
      new HttpError("Could not fetch companies, please try again", 500)
    );
  }
};

exports.createCompany = createCompany;
exports.getCompanies = getCompanies;
