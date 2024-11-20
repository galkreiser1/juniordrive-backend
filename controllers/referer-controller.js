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

  const { name, numReferrals, role, linkedin, email, availability } = req.body;

  let { company } = req.body;
  company = company.toLowerCase();

  try {
    let existingCompany = await Company.findOne({ name: company });
    if (!existingCompany) {
      const newCompany = new Company({ name: company });
      await newCompany.save();
    }
    let existingReferer = await Referer.findOne({ email });

    if (existingReferer) {
      existingReferer.name = name;
      existingReferer.role = role;
      existingReferer.linkedin = linkedin || "";
      existingReferer.company = company;
      existingReferer.availability = availability || "Available";

      await existingReferer.save();
      res.status(200).json({ referer: existingReferer });
    } else {
      // Create a new referer
      const newReferer = new Referer({
        company,
        name,
        role,
        email,
        linkedin: linkedin || "",
        numReferrals: 0,
        availability: "Available",
      });

      await newReferer.save();
      res.status(201).json({ referer: newReferer });
    }
  } catch (e) {
    console.log("Fail", e);
    return next(
      new HttpError("Error creating or updating referer, please try again", 500)
    );
  }
};

const deleteReferer = async (req, res, next) => {
  const email = req.params.email;

  try {
    const referer = await Referer.findOneAndDelete({ email });
    if (!referer) {
      return next(new HttpError("Referer not found", 404));
    }
    res.status(200).json({ message: "Referer deleted successfully" });
  } catch (e) {
    return next(new HttpError("Error deleting referer, please try again", 500));
  }
};

const getReferer = async (req, res, next) => {
  const email = req.params.email;

  try {
    const referer = await Referer.findOne({ email });
    if (!referer) {
      res.status(200).json({ referer: null });
    } else {
      res.status(200).json({ referer });
    }
  } catch (e) {
    return next(new HttpError("Error getting referer, please try again", 500));
  }
};

exports.getReferers = getReferers;
exports.createReferer = createReferer;
exports.deleteReferer = deleteReferer;
exports.getReferer = getReferer;

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
