// lib
// src
const Admin = require("../models/admin");
const Greylist = require("../models/greylist");
const User = require("../models/user");

const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.adminPermissions) {
    res.sendStatus(403);
  } else {
    next();
  }
};

const requireSuperAdmin = async (req, res, next) => {
  if (!req.user) return res.sendStatus(403);
  const superAdmin = await Admin.adminHasPermissions(req.user.email, [
    Admin.permissions.SUPER_ADMIN,
  ]);
  if (!superAdmin) return res.sendStatus(403);
  return next();
};

const requireBookingPermissions = async (req, res, next) => {
  const { email: userEmail } = req.user;
  const isWhitelisted = await User.isUserWhitelisted(userEmail);
  req.permission = {
    isWhitelisted,
  };
  if (!isWhitelisted) {
    req.permission.onlyRoomIds = await Greylist.findRoomIdsForUser(userEmail);
  }
  next();
};

module.exports = {
  requireAdmin,
  requireSuperAdmin,
  requireBookingPermissions,
};
