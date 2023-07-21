// @flow

const mongoose = require("mongoose");

const uniq = require("lodash/uniq");
const sortBy = require("lodash/sortBy");

const { adminHasPermissions, permissions } = require("./admin");

const actionCodes = {};

/* ::
  type Dysfunction = {
    emailDelegate: string,
    name: string,
    icon: string,
    actionCode?: string,
    order?: number,
  }
*/
const schema = mongoose.Schema({
  emailDelegate: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  icon: { type: String, required: true },
  actionCode: { type: String },
  order: { type: Number },
});

const DysfunctionModel = mongoose.model("Dysfunction", schema);

/* ::
  type GenerateDysfunction = (adminEmail: string, dysfunction: Dysfunction) => Promise<Dysfunction>
*/
const generateDysfunction /* : GenerateDysfunction */ = async (
  adminEmail,
  dysfunction,
) => {
  if (!(await adminHasPermissions(adminEmail, [permissions.ADD_DYSFUNCTION]))) {
    throw new Error("don't have the rights");
  }
  if (dysfunction.actionCode) {
    if (!Object.values(actionCodes).includes(dysfunction.actionCode)) {
      throw new Error("invalid action code");
    }
  }
  const dysfunctionInstance = new DysfunctionModel(dysfunction);
  return dysfunctionInstance.save();
};

/* ::
  type GetAllDysfunctions = () => Promise<Dysfunction[]>
*/
const getAllDysfunctions /* : GetAllDysfunctions */ = () =>
  DysfunctionModel.find();

/* ::
  type GetDysfunctionFromName = (dName: string) => Promise<Dysfunction | null>
*/
const getDysfunctionFromName /* : GetDysfunctionFromName */ = async dName =>
  DysfunctionModel.findOne({ name: dName });

/* ::
  type UpdateDysfunction = (adminEmail: string, newDysfunction: Dysfunction) => Promise<Dysfunction>
*/
const updateDysfunction /* : UpdateDysfunction */ = async (
  adminEmail,
  newDysfunction,
) => {
  if (!(await adminHasPermissions(adminEmail, [permissions.ADD_DYSFUNCTION]))) {
    console.log("sorry");
    throw new Error("don't have the rights");
  }
  const dysfunction = await getDysfunctionFromName(newDysfunction.name);
  if (dysfunction === null) {
    throw new Error(
      `Dysfunction with name "${newDysfunction.name}" doesn't exist`,
    );
  }
  dysfunction.emailDelegate = newDysfunction.emailDelegate;
  dysfunction.icon = newDysfunction.icon;
  dysfunction.actionCode = newDysfunction.actionCode;
  // $FlowFixMe
  return dysfunction.save();
};

/* ::
  type RemoveDysfunctionFromName = (adminEmail: string, dysfunctionName: string) => Promise<void>
*/
const removeDysfunctionFromName /* : RemoveDysfunctionFromName */ = async (
  adminEmail,
  dysfunctionName,
) => {
  if (!(await adminHasPermissions(adminEmail, [permissions.ADD_DYSFUNCTION]))) {
    console.log("sorry");
    throw new Error("don't have the rights");
  }
  return DysfunctionModel.remove({ name: dysfunctionName });
};

/* ::
  type GetDelegatesFromNames = (names: string[]) => Promise<string[]>
*/
const getDelegatesFromNames /* : GetDelegatesFromNames */ = async names => {
  const dysfunctions = (await Promise.all(
    names.map(dName => getDysfunctionFromName(dName)),
  )).filter(Boolean);
  return uniq(dysfunctions.map(dysfunction => dysfunction.emailDelegate));
};

/* ::
  type UpdateOrder = (order: string[]) => Promise<string[]>
*/
const updateOrder /* : UpdateOrder */ = async order => {
  const dysfunctions = await getAllDysfunctions();

  const names = dysfunctions.map(dysfunction => dysfunction.name);
  if (
    names.length !== order.length ||
    !order.every(orderName => names.includes(orderName))
  ) {
    throw new Error("invalid orders");
  }

  const newOrder = await Promise.all(
    dysfunctions.map(dysfunction => {
      // eslint-disable-next-line
      dysfunction.order = order.findIndex(
        orderName => dysfunction.name === orderName,
      );
      // $FlowFixMe
      return dysfunction.save();
    }),
  );

  return sortBy(newOrder, "order").map(dysfunction => dysfunction.name);
};

module.exports = {
  generateDysfunction,
  getAllDysfunctions,
  getDysfunctionFromName,
  updateDysfunction,
  removeDysfunctionFromName,
  getDelegatesFromNames,
  updateOrder,
};
