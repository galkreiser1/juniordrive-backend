const capitalizeCompanyName = (companyName) => {
  return companyName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

exports.capitalizeCompanyName = capitalizeCompanyName;
