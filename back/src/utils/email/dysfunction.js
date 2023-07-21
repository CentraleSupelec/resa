// lib
const logger = require("../logger");
// src
const send = require("./send");

const template = require("./bodies/template");

async function sendReport(room, author, comment, dysfunctions, delegates) {
  try {
    // SUBJECT
    const s = dysfunctions.length === 1 ? "" : "s";
    const avoir = dysfunctions.length === 1 ? "a" : "ont";
    const subject = `Dysfonctionnement${s} signalé${s} en ${room.name}`;

    // BODY
    const data = {
      previewText: `${subject}.`,
      textBeforeButton: `
<h4>${subject}</h4>
<p>Le${s} dysfonctionnement${s} suivant : ${dysfunctions.join(", ")} ${avoir}
été signalé${s} en ${room.name}</p>
<p>
Le commentaire suivant a été laissé :
<center>${comment.replace(/\n/g, "<br>")}</center><br>
</p>
Si vous souhaitez avoir plus d'information, contactez <a href="mailto:${author}">${author}</a>.
`,
      roomId: room.id,
    };

    const htmlBody = template(data);

    const plainBody = `
${subject}
Le${s} dysfonctionnement${s} suivant${s} : ${dysfunctions.join(", ")} ${avoir}
été signalé${s} en ${room.name}
Le commentaire suivant a été laissé :
${comment}
Si vous souhaitez avoir plus d'information, contactez ${author}.
  `;

    // SEND
    await send(delegates, subject, plainBody, htmlBody);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  sendReport,
};
