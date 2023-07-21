// lib
const R = require("ramda");
// src
const Setting = require("./setting");

const isUserWhitelisted = async (userEmail) => {
  const whitelist = await Setting.getWhitelist();
  if (!whitelist || !whitelist.value) return false;
  const domains = whitelist.value.split(",");
  return R.any((d) => {
    const matcher = new RegExp(`@${d}$`, "i");
    return matcher.test(userEmail);
  }, domains);
};

module.exports = { isUserWhitelisted };
