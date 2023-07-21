// lib
const moment = require("moment");
// src
const template = require("./template");
// configuration
require("moment/locale/fr");

function getHTMLBody(booking, room, author, managerEmails) {
  const openingStatement = `Votre réservation en ${room.name} est refusée.`;

  const data = {
    previewText: `${openingStatement}.`,
    textBeforeButton: `
<h4>${openingStatement}</h4>
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
Réservée par ${author.firstName} ${author.lastName}
</center>
`,
    roomId: room.id,
    textAfterButton: `Si vous souhaitez avoir plus d'information, contactez ${
      managerEmails[0]
    }.`,
  };

  return template(data);
}

function getPlainBody(booking, room, author, managerEmails) {
  return `
Votre réservation en ${room.name} est refusée.
${booking.eventName}
${moment(booking.startDate)
  .utc()
  .format("dddd D MMMM YYYY")}
${moment(booking.startDate)
  .utc()
  .format("H[h]mm")} à ${moment(booking.endDate)
    .utc()
    .format("H[h]mm")}
    Réservée par ${author.firstName} ${author.lastName}

Si vous souhaitez avoir plus d'information, contactez ${managerEmails[0]}.
  `;
}

module.exports = {
  getHTMLBody,
  getPlainBody,
};
