// @flow
const mongoose = require("mongoose");
const moment = require("moment");

const permissions = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADD_DYSFUNCTION: "ADD_DYSFUNCTION",
  ADD_NEW_ADMIN: "ADD_NEW_ADMIN",
  ADD_MANAGER: "ADD_MANAGER",
};

/* ::
  type VerifyPermissions = (inputPermission: string[]) => boolean
*/
const verifyPermissions /* : VerifyPermissions */ = inputPermissions => {
  if (!Array.isArray(inputPermissions)) {
    return false;
  }
  return inputPermissions.every(
    permission => permissions[permission] !== undefined,
  );
};

/* ::
type Admin = {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  permissions: string[],
  addedBy: string,
  addedAt: Date
}
*/
const schema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  permissions: { type: [String], required: true },
  addedBy: { type: String, required: true },
  addedAt: { type: Date, required: true },
});

const AdminModel = mongoose.model("Admin", schema);

/* ::
  type GenerateAdmin = (rawAdmin: {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  permissions: ?string[],
  addedBy: string,
}) => Promise<Admin>
*/
const generateAdmin /* : GenerateAdmin */ = rawAdmin => {
  const admin = {
    ...rawAdmin,
    addedAt: moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
  };
  const adminInstance = new AdminModel(admin);
  if (!admin.permissions || !Array.isArray(admin.permissions)) {
    admin.permissions = [];
  }
  if (!verifyPermissions(admin.permissions)) {
    return Promise.reject(new Error("Permissions aren't valid"));
  }
  return adminInstance.save();
};

/* ::
  type GetAllAdmins = () => Promise<Admin[]>
*/
const getAllAdmins /* : GetAllAdmins */ = () => AdminModel.find();

/* ::
  type GetAdminFromEmail = (email: string) => Promise<Admin | null>
*/
const getAdminFromEmail /* : GetAdminFromEmail */ = email =>
  AdminModel.findOne({ email });

/* ::
 type IsAdmin = (email: string) => Promise<boolean>
*/
const isAdmin /* : IsAdmin */ = async email => {
  try {
    const admin = await getAdminFromEmail(email);
    if (admin) {
      return true;
    }
    throw new Error("err");
  } catch (e) {
    return false;
  }
};

/* ::
 type AdminHasPermissions = (email: string, inputPermissions: string[]) => Promise<boolean>
*/
const adminHasPermissions /* : AdminHasPermissions */ = async (
  email,
  inputPermissions,
) => {
  try {
    if (!verifyPermissions(inputPermissions)) {
      return false;
    }
    const admin = await getAdminFromEmail(email);
    if (admin === null) {
      return false;
    }
    if (admin.permissions.includes(permissions.SUPER_ADMIN)) {
      return true;
    }
    return inputPermissions.every(permission =>
      admin.permissions.includes(permission),
    );
  } catch (e) {
    return false;
  }
};

/* ::
  type RemoveAdminFromEmail = (email: string) => Promise<void>
*/
const removeAdminFromEmail /* : RemoveAdminFromEmail */ = email =>
  AdminModel.remove({ email });

module.exports = {
  permissions,
  generateAdmin,
  getAllAdmins,
  getAdminFromEmail,
  isAdmin,
  adminHasPermissions,
  removeAdminFromEmail,
};
