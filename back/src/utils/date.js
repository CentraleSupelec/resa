const moment = require("moment");
const momentTimezone = require("moment-timezone");

const toISOString = date => moment(date).format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]");

const shiftTimeZone = (UTCdate, tz = "Europe/Paris") => {
  const dateWithNoTZ = [
    UTCdate.getUTCFullYear(),
    UTCdate.getUTCMonth(),
    UTCdate.getUTCDate(),
    UTCdate.getUTCHours(),
    UTCdate.getUTCMinutes(),
  ];
  return new Date(momentTimezone.tz(dateWithNoTZ, tz));
};

module.exports = { toISOString, shiftTimeZone };
