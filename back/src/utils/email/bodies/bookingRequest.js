// lib
const moment = require("moment");
// src
const template = require("./template");
// configuration
require("moment/locale/fr");

function getHTMLBody(
  booking,
  room,
  author,
  subject,
  subjectWithMailTo,
  link,
  managerEmails,
  imageExists,
) {
  const data = {
    previewText: `${subject}.`,
    textBeforeButton: `
<h4>${subjectWithMailTo}</h4>
<center>
<b>${booking.eventName}</b><br>
${moment(booking.startDate)
  .utc()
  .format("dddd D MMMM YYYY")}<br>
de ${moment(booking.startDate)
      .utc()
      .format("H[h]mm")} à ${moment(booking.endDate)
      .utc()
      .format("H[h]mm")}<br>
Réservation faite par ${author.firstName} ${author.lastName}.
</center>
<br>

  `,
    buttonText: "Consulter cette demande de réservation",
    link,
    imageExists,
    roomId: room.id,
  };
  return template(data);
}

function getPlainBody(booking, room, author, subject) {
  return `
  ${subject} :

  ${booking.eventName}
  ${moment(booking.startDate)
    .utc()
    .format("dddd D MMMM YYYY")}
  ${moment(booking.startDate)
    .utc()
    .format("H[h]mm")} > ${moment(booking.endDate)
    .utc()
    .format("H[h]mm")}
Réservation faite par ${author.firstName} ${author.lastName}.
  `;
}

module.exports = {
  getHTMLBody,
  getPlainBody,
};
