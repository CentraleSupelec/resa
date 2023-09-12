// lib
const md = require("markdown-it")({ linkify: true });
const moment = require("moment");
// src
const template = require("./template");
// configuration
require("moment/locale/fr");

const FRIENDLY_FLOOR_NAME = {
  "-1": "Sous-sol",
  0: "Rez-de-chaussée",
  1: "1er étage",
  2: "2e étage",
  3: "3e étage",
  4: "4e étage",
  5: "5e étage",
};

function getHTMLBody(
  ownUrl,
  room,
  eventName,
  startDate,
  endDate,
  user,
  videoAccessDetails,
  isModification,
  imageExists,
) {
  const htmlLocation = room.location
    ? `<a href="${room.location}">${room.name}</a>`
    : room.name;

  const openingStatement = isModification
    ? `Votre réservation en ${room.name} ${
        room.modular && "(Salle décloisonnée)"
      } a bien été modifiée.`
    : `Votre réservation en ${room.name} ${
        room.modular && "(Salle décloisonnée)"
      } est confirmée.`;

  // Format e-mail content
  const data = {
    previewText: `${openingStatement}.`,
    textBeforeButton: `
<h4>${openingStatement}</h4>

<center>
<b>${eventName}</b><br>
${moment(startDate).utc().format("dddd D MMMM YYYY")}<br>
de ${moment(startDate).utc().format("H[h]mm")} à ${moment(endDate)
      .utc()
      .format("H[h]mm")}<br>
Réservée par ${user.firstName} ${user.lastName}.
</center>
${videoAccessDetails ? md.render(videoAccessDetails) : ""}
<br>
<h4>Pour vous y rendre :</h4>
<center>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="0.67em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1536"><path d="M768 512q0-106-75-181t-181-75-181 75-75 181 75 181 181 75 181-75 75-181zm256 0q0 109-33 179l-364 774q-16 33-47.5 52t-67.5 19-67.5-19-46.5-52L33 691Q0 621 0 512q0-212 150-362T512 0t362 150 150 362z" fill="#626262"/></svg> ${htmlLocation}<br>
Bâtiment ${room.building}<br>
Univers ${room.wing}<br>
${FRIENDLY_FLOOR_NAME[room.floor]}
</center>
  `,
    buttonText: "Modifier ou annuler cette réservation",
    link: `${ownUrl}reservations`,
    textAfterButton: `
<p>Pour rappel, les salles de réunion sont accessibles avec votre badge du lundi au vendredi entre 07h00 et 23h00. Pour toute réservation d’une salle en dehors de ces plages horaires, merci de faire une demande auprès du <a href="mailto:support.dpiet@listes.centralesupelec.fr">support.dpiet@listes.centralesupelec.fr</a> afin de pouvoir accéder à la salle.
</p>
<table>
  <tr>
    <td style="width: 40%; text-align: left; margin-right: 16px; border-right: solid 1px black">
      Pour localiser la salle : <a href="${ownUrl}campass.html">Campass</a>
      <br />
      <br />
      Vous pouvez ajouter simplement cette réservation à votre calendrier en ouvrant l'évènement en pièce-jointe
    </td>
    <td style="text-align: left; margin-left: 16px">
      N’hésitez pas à nous signaler tout problème dans la salle : utilisation du matériel, désordre, ménage, manque de petit matériel (craies, feutres, câbles, …), à <a href="mailto:support.dpiet@listes.centralesupelec.fr">support.dpiet@listes.centralesupelec.fr</a> ou au <a href="tel:66.66">66.66</a>.
    </td>
  <tr>
</table>
`,

    imageExists,
    roomId: room.id,
  };

  return template(data);
}

function getPlainBody(
  ownUrl,
  room,
  eventName,
  startDate,
  endDate,
  user,
  videoAccessDetails,
  isModification,
) {
  const openingStatement = isModification
    ? `Votre réservation en ${room.name} ${
        room.modular && "(Salle décloisonnée)"
      } a bien été modifiée.`
    : `Votre réservation en ${room.name} ${
        room.modular && "(Salle décloisonnée)"
      } est confirmée.`;

  return `
${openingStatement} :
${eventName}
${moment(startDate).utc().format("dddd D MMMM YYYY")}
${moment(startDate).utc().format("H[h]mm")} > ${moment(endDate)
    .utc()
    .format("H[h]mm")}
Réservée par ${user.firstName} ${user.lastName}.
${videoAccessDetails || ""}

Pour vous y rendre :
${room.name} ${room.location || ""}
Bâtiment ${room.building}
Univers ${room.wing}
${FRIENDLY_FLOOR_NAME[room.floor]}

À tout moment, vous pouvez modifier ou annuler cette réservation sur resa.centralesupelec.fr.

Pour rappel, les salles de réunion sont accessibles avec votre badge du lundi au vendredi entre 07h00 et 23h00. Pour toute réservation d’une salle en dehors de ces plages horaires, merci de faire une demande auprès du support.dpiet@listes.centralesupelec.fr afin de pouvoir accéder à la salle.

Pour localiser la salle, aller sur Campass : ${ownUrl}campass.html

Vous pouvez ajouter simplement cette réservation à votre calendrier en ouvrant l'évènement en pièce-jointe.

N’hésitez pas à nous signaler tout problème dans la salle : utilisation du matériel, désordre, ménage, manque de petit matériel (craies, feutres, câbles, …), à support.dpiet@listes.centralesupelec.fr ou au 66.66.
`;
}

module.exports = {
  getHTMLBody,
  getPlainBody,
};
