// @flow
// lib
const mongoose = require("mongoose");

/* ::
  export type Setting = {
    name: string,
    value: string
  }
*/

const schema = mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  value: { type: String, required: true },
});

const WHITELISTS = "whitelists";

/* ::
  type OneByName = () => Promise<Setting>
*/
schema.statics.findOneByName /* OneByName */ = function findOneByName(name) {
  return this.findOne({ name });
};

schema.statics.updateOneByName /* OneByName */ = function updateOneByName(
  name,
  value,
) {
  return this.updateOne({ name }, { $set: { value } }, { upsert: true });
};

schema.statics.getWhitelist /* OneByName */ = function getWhitelists() {
  return this.findOne({ name: WHITELISTS }).select("value -_id");
};

schema.statics.updateWhitelist /* OneByName */ = function updateWhitelists(
  value,
) {
  return this.updateOne(
    { name: WHITELISTS },
    { $set: { value } },
    { upsert: true },
  );
};

const SettingModel = mongoose.model("Setting", schema);

module.exports = SettingModel;
