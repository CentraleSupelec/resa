// @flow

const mongoose = require("mongoose");
const moment = require("moment");
const { generateToken } = require("../utils/cypher");
const logger = require("../utils/logger");

require("moment/locale/fr");

/* ::
  import type { Book, Event } from "../types.flow"
*/

const schema = mongoose.Schema({
  roomId: { type: Number, required: true },
  userId: { type: String, required: true },
  userFirstName: { type: String, required: true },
  userLastName: { type: String, required: true },
  userEmail: { type: String, required: true, index: true },
  isCentraleSupelec: { type: Boolean },
  eventName: { type: String, required: true, index: true },
  startDate: { type: Date, required: true, index: true },
  endDate: { type: Date, required: true },
  token: { type: String, required: true, unique: true },
  sentEmailDate: { type: Date, required: true },
  videoProvider: String,
  responseDate: { type: Date, index: true },
  isApproved: { type: Boolean, required: true, default: false },
});

const BookModel = mongoose.model("Book", schema);

/* ::
  type GenerateBooking = (book: {
    roomId: number,
    userId: string,
    userFirstName: string,
    userLastName: string,
    userEmail: string,
    isCentraleSupelec: boolean,
    eventName: string,
    startDate: Date,
    endDate: Date,
    sentEmailDate: Date,
    videoProvider?: string,
    responseDate?: Date,
    isApproved?: boolean,
  }) => Promise<Book>
*/
const generateBooking /* : GenerateBooking */ = (book) => {
  const cleanBook = { ...book, token: generateToken(book) };
  const bookInstance = new BookModel(cleanBook);
  return bookInstance.save();
};

/* ::
  type GetBookingFromToken = (token: string) => Promise<Book | null>
*/
const getBookingFromToken /* : GetBookingFromToken */ = async (token) =>
  BookModel.findOne({ token });

/* ::
  type UpdateApprovalFromToken = (token: string, isApproved:boolean) => Promise<Book>
*/
const updateApprovalFromToken /* : UpdateApprovalFromToken */ = async (
  token,
  isApproved,
) => {
  const book = await getBookingFromToken(token);
  if (book === null) {
    throw new Error(`Booking with token "${token}" doesn't exist`);
  }
  if (book.responseDate) {
    throw new logger.Error("Already approved");
  }
  book.responseDate = new Date(moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"));
  book.isApproved = Boolean(isApproved);
  // $FlowFixMe
  return book.save();
};

/* ::
 type GetBookingRequestsBetweenDates = (startDate: string | Date, endDate: string | Date) => Promise<Book[]>
*/
const getBookingRequestsBetweenDates /* : GetBookingRequestsBetweenDates */ = (
  startDate,
  endDate,
) => {
  const [parsedStartDate, parsedEndDate] = [
    new Date(startDate),
    new Date(endDate),
  ];
  const bookingEndsDuringPeriod = {
    endDate: { $gt: parsedStartDate, $lte: parsedEndDate },
  };
  const bookingStartsDuringPeriod = {
    startDate: { $gte: parsedStartDate, $lt: parsedEndDate },
  };
  const bookingOverlapsPeriod = {
    startDate: { $lte: parsedStartDate },
    endDate: { $gte: parsedEndDate },
  };

  return BookModel.find({
    $and: [
      {
        $or: [
          bookingEndsDuringPeriod,
          bookingStartsDuringPeriod,
          bookingOverlapsPeriod,
        ],
      },
      { responseDate: null },
    ],
  });
};

/* ::
  type GetEventsInRoomAtDate = (roomId: number, selectedDate: string) => Promise<Book[]>
*/
const getEventsInRoomAtDate /* : GetEventsInRoomAtDate */ = (
  roomId,
  selectedDate,
) => {
  const startDate = new Date(
    moment(selectedDate).format("YYYY-MM-DD[T]00:00:00.000[Z]"),
  );
  const endDate = new Date(
    moment(selectedDate).add(1, "day").format("YYYY-MM-DD[T]00:00:00.000[Z]"),
  );
  return (
    getBookingRequestsBetweenDates(startDate, endDate)
      // $FlowFixMe
      .where("roomId")
      .equals(roomId)
  );
};

/* ::
  type GetLocalEventsStapledPerson = (userEmail: string) => Promise<Event[]>
*/
const getLocalEventsStapledPerson /* : GetLocalEventsStapledPerson */ = async (
  userEmail,
) => {
  const bookings = await BookModel.find({ userEmail, responseDate: null });
  return bookings.map((booking) => ({
    id: `local_${booking._id}`,
    token: booking.token,
    local: true,
    name: booking.eventName,
    type: "rendez-vous",
    roomId: booking.roomId,
    authorId: booking.userId,
    startDate: moment.utc(booking.startDate),
    endDate: moment.utc(booking.endDate),
  }));
};

module.exports = {
  generateBooking,
  getBookingFromToken,
  updateApprovalFromToken,
  getBookingRequestsBetweenDates,
  getEventsInRoomAtDate,
  getLocalEventsStapledPerson,
};
