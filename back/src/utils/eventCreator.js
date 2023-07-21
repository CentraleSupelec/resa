// lib
const ics = require("ics");
const { promisify } = require("util");
// src
const { shiftTimeZone } = require("./date");

function ISOtoArray(ISOstring) {
  // Since ICS v2.0, "start" and "end" date are expected to be in an array
  // format (for example: [2018, 5, 30, 6, 30])

  // Sent date describes the booking time in the "room timezone"
  // so the UTC referential needs to be removed from ISOstring
  const d = shiftTimeZone(new Date(ISOstring));

  // +1 month index shift for ics module
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ];
}

function createEvent(
  ownUrl,
  eventId,
  eventName,
  startDate,
  endDate,
  roomName,
  user,
  description,
) {
  const formattedDescription = description
    ? `${description}\n\nPour toute modification ou annulation de la réunion, rendez-vous sur ${ownUrl}`
    : "";

  return promisify(ics.createEvent)({
    uid: eventId, // (optional)
    start: ISOtoArray(startDate),
    startInputType: "utc",
    end: ISOtoArray(endDate),
    endInputType: "utc",
    title: eventName,
    description: formattedDescription,
    location: `${roomName}`,
    url: `${ownUrl}reservations`,
    status: "CONFIRMED",
    organizer: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
    },
    categories: [],
    alarms: [],
  });
}

module.exports = { createEvent };
