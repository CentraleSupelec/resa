// @flow

const mongoose = require("mongoose");
/* ::
  export type Meeting = {
    eventId: number,
    meetingId: string,
    provider: string,
    deleted: boolean
  }
*/
const schema = mongoose.Schema({
  eventId: { type: Number, required: true, index: true },
  meetingId: { type: String, required: true, index: true },
  provider: { type: String, required: true },
  deleted: { type: Boolean, default: false },
});

/* ::
type ReturnMeeting = () => Promise<Meeting>
*/

schema.statics.findByEventId /* ReturnMeeting */ = function findByEventId(
  eventId,
) {
  return this.findOne({ eventId });
};

schema.statics.markAsDeleted /* OneByName */ = function markAsDeleted(
  meetingId,
) {
  return this.updateOne({ meetingId }, { $set: { deleted: true } });
};

const MeetingModel = mongoose.model("Meeting", schema);

module.exports = MeetingModel;
