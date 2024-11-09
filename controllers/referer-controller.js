const HttpError = require("../models/http-error");
const { createRefererSchema } = require("../validators/referer-validator");
const Referer = require("../models/referer");
const Company = require("../models/company");
const utils = require("../utils/utils");

const getReferers = async (req, res, next) => {
  const companyName = req.params.company;

  try {
    const referers = await Referer.find({
      company: new RegExp(`^${companyName}$`, "i"),
    });

    res.status(200).json(referers);
  } catch (err) {
    return next(
      new HttpError("Error fetching referers, please try again", 500)
    );
  }
};

const createReferer = async (req, res, next) => {
  const { error } = createRefererSchema.validate(req.body);
  if (error) {
    return next(new HttpError(error.details[0].message, 400));
  }

  const {
    firstName,
    lastName,
    numReferrals,
    role,
    linkedin,
    email,
    availability,
  } = req.body;

  let { company } = req.body;
  company = company.toLowerCase();

  const newReferer = new Referer({
    company,
    firstName,
    lastName,
    role,
    email,
    linkedin: linkedin || "",
    numReferrals: 0,
    availability: "Available",
  });

  try {
    let existingCompany = await Company.findOne({ name: company });
    if (!existingCompany) {
      const newCompany = new Company({ name: company });
      await newCompany.save();
    }

    await newReferer.save();
    res.status(201).json({ referer: newReferer });
  } catch (e) {
    return next(
      new HttpError("Error creating new referer, please try again", 500)
    );
  }
};

exports.getReferers = getReferers;
exports.createReferer = createReferer;

//const data = [
//   {
//     company: "Google",
//     name: "Jane Doe",
//     numReferrals: 10,
//     role: "Software Engineer",
//     contacts: [
//       { type: "LinkedIn", url: "https://linkedin.com/in/jane" },
//       { type: "Email", url: "mailto:jane.doe@gmail.com" },
//     ],
//     location: "Tel Aviv, Israel",
//     availability: "Available",
//   },
//   {
//     company: "Microsoft",
//     name: "John Smith",
//     numReferrals: 10,
//     role: "Senior Developer",
//     contacts: [{ type: "Email", url: "mailto:john.smith@microsoft.com" }],
//     location: "New York, USA",
//     availability: "Unavailable",
//   },
//   {
//     company: "Microsoft",
//     name: "Mark Brown",
//     numReferrals: 10,
//     role: "Cloud Architect",
//     contacts: [
//       { type: "LinkedIn", url: "https://linkedin.com/in/mark" },
//       { type: "Email", url: "mailto:mark.brown@amazon.com" },
//     ],
//     location: "Seattle, USA",
//     availability: "Available",
//   },
// ];
