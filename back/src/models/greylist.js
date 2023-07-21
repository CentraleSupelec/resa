// lib
const mongoose = require("mongoose");
const slugify = require("slugify");
const R = require("ramda");

const schema = mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  roomIds: { type: [Number], index: true },
  managerEmails: { type: [String], index: true },
  userEmails: { type: [String], index: true },
  domains: { type: [String], index: true },
});

const GreylistModel = mongoose.model("Greylist", schema);

const addSlug = (fields) => ({
  ...fields,
  ...(fields.name && { slug: slugify(fields.name) }),
});

const create = (fields) => GreylistModel.create(addSlug(fields));

const update = (slug, fields) =>
  GreylistModel.updateOne({ slug }, addSlug(fields));

const find = () => GreylistModel.find();

const getNames = () => GreylistModel.find().select("name");

const findBySlug = (slug) => GreylistModel.findOne({ slug });

const findRoomIdsByDomain = async (domain) => {
  const result = await GreylistModel.find({ domains: domain }).select(
    "roomIds -_id",
  );
  return R.map(({ roomIds }) => roomIds, result);
};

const findRoomIdsByUser = async (userEmail) => {
  const result = await GreylistModel.find({ userEmails: userEmail }).select(
    "roomIds -_id",
  );
  return R.map(({ roomIds }) => roomIds, result);
};

const findRoomIdsForUser = async (userEmail) => {
  const userEmailDomain = userEmail.split("@")[1];
  const idsForUserDomain = await findRoomIdsByDomain(userEmailDomain);
  const idsForUser = await findRoomIdsByUser(userEmail);
  return R.uniq(R.flatten([...idsForUserDomain, ...idsForUser]));
};

const getNamesIfManager = (email) =>
  GreylistModel.find({ managerEmails: email }).select("name");

const deleteOne = (slug) => GreylistModel.deleteOne({ slug });

module.exports = {
  create,
  find,
  findBySlug,
  findRoomIdsForUser,
  getNames,
  getNamesIfManager,
  deleteOne,
  update,
};
