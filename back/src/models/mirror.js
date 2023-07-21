// @flow
// lib
const mongoose = require("mongoose");
const R = require("ramda");
require("moment/locale/fr");

/* ::
  import type { Mirror } from "../types.flow"
*/

const schema = mongoose.Schema({
  eventId: { type: Number, index: true },
  token: { type: String, index: true },
  userEmail: { type: String, required: true, index: true },
  startDate: { type: Date, required: true, index: true },
});

const MirrorModel = mongoose.model("Mirror", schema);

/* ::
  type GenerateMirror = (fields: Mirror) => Promise<Mirror>
*/
const generate /* : GenerateMirror */ = (fields) => {
  const instance = new MirrorModel(fields);
  return instance.save();
};

/* ::
  type UpgradeMirror = (token: string, eventId: number) => Promise<Mirror>
*/
const upgradeFromTokenToEventId /* : UpgradeMirror */ = (token, eventId) =>
  MirrorModel.updateOne({ token }, { $set: { eventId }, $unset: { token } });

/* ::
  type GetForUser = (userEmail: string) => Promise<{ eventIds: Array<number>, tokens: Array<string>}>
*/
const getForUser /* : GetForUser */ = async (userEmail) => {
  const result = await MirrorModel.find({
    userEmail,
    startDate: { $gte: new Date() },
  }).select("eventId token -_id");
  const eventIds = R.map(({ eventId }) => eventId, result);
  const tokens = R.map(({ token }) => token, result);
  return { eventIds, tokens };
};

/* ::
  type RemoveByEventId = (eventId: number) => Promise<void>
*/
const removeByEventId /* : RemoveByEventId */ = (eventId) =>
  MirrorModel.deleteOne({ eventId });

/* ::
    type RemoveByToken = (token: string) => Promise<void>
  */
const removeByToken /* : RemoveByToken */ = (token) =>
  MirrorModel.deleteOne({ token });

module.exports = {
  generate,
  upgradeFromTokenToEventId,
  getForUser,
  removeByEventId,
  removeByToken,
};
