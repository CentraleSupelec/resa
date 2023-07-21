// lib
const moment = require("moment");
const got = require("got");
// src
const eventCreator = require("../eventCreator");
const config = require("../../config");
const logger = require("../logger");
const Member = require("../../models/member");
const send = require("./send");
// email bodies
const {
  getHTMLBody: getConfirmHTMLBody,
  getPlainBody: getConfirmPlainBody,
} = require("./bodies/bookingConfirm");
const {
  getHTMLBody: getDeclineHTMLBody,
  getPlainBody: getDeclinePlainBody,
} = require("./bodies/bookingDecline");
const {
  getHTMLBody: getRequestHTMLBody,
  getPlainBody: getRequestPlainBody,
} = require("./bodies/bookingRequest");
// configuration
require("moment/locale/fr");

const getManagersEmailOfRoom = async (room) => {
  const managerEmails = (
    await Promise.all(
      room.belongsTo.map(({ groupId }) => Member.managersOfGroup(groupId)),
    )
  )
    .reduce(
      (totalManagers, managersOfThisGroup) => [
        ...totalManagers,
        ...managersOfThisGroup,
      ],
      [],
    )
    .sort((A, B) => (B.isMainManager || 0) - (A.isMainManager || 0))
    .map(({ email }) => email);
  if (managerEmails.length === 0) {
    throw new Error(`No managers for room ${room.id}`);
  }
  return managerEmails;
};

async function doesRoomImageExists(roomId) {
  /*
  Returns true if image URL gets a 2xx response code
  Else returns false (in particular, return false if image URL gets a 404)
  */
  try {
    await got(`https://resa.centralesupelec.fr/roomImages/${roomId}.jpg`);
    return true;
  } catch (error) {
    return false;
  }
}

// if isModification === true, it means the booking already existed and is simply being modified
async function sendConfirm(
  ownUrl, // either defaultOwnUrl or altOwnUrl in config
  room,
  eventId,
  eventName,
  startDate,
  endDate,
  user,
  isModification,
  videoAccessDetails,
) {
  try {
    // SUBJECT
    let subject = `${
      isModification ? "Modification" : "Confirmation"
    } de votre réservation en ${room.name} le ${moment(startDate)
      .utc()
      .format("dddd D MMMM YYYY")}.`;
    const { videoConference } = room;
    if (videoConference && !!videoAccessDetails) {
      subject = `Pour vous connecter à la visio en ${room.name} le ${moment(
        startDate,
      )
        .utc()
        .format("dddd D MMMM YYYY")}.`;
    }

    // BODY

    const imageExists = await doesRoomImageExists(room.id);

    const htmlBody = getConfirmHTMLBody(
      ownUrl,
      room,
      eventName,
      startDate,
      endDate,
      user,
      videoAccessDetails,
      isModification,
      imageExists,
    );

    const plainBody = getConfirmPlainBody(
      ownUrl,
      room,
      eventName,
      startDate,
      endDate,
      user,
      videoAccessDetails,
      isModification,
    );

    // CC
    const bcc = videoConference ? config.ccEmail : undefined;

    // ATTACHMENTS
    const ics = await eventCreator.createEvent(
      ownUrl,
      eventId,
      eventName,
      startDate,
      endDate,
      room.name,
      user,
      videoAccessDetails,
    );

    const attachments = [
      {
        // utf-8 string as an attachment
        filename: `Réservation ${room.name}.ics`,
        content: ics,
      },
    ];

    // SEND
    send(user.email, subject, plainBody, htmlBody, attachments, bcc);
  } catch (error) {
    logger.error(error);
  }
}

async function sendDecline(booking, room, author) {
  try {
    // SUBJECT
    const subject = `Rejet de votre réservation en ${room.name} le ${moment(
      booking.startDate,
    )
      .utc()
      .format("dddd D MMMM YYYY")}.`;

    // BODY
    const managerEmails = await getManagersEmailOfRoom(room);
    const htmlBody = getDeclineHTMLBody(booking, room, author, managerEmails);
    const plainBody = getDeclinePlainBody(booking, room, author, managerEmails);

    // SEND
    await send(author.email, subject, plainBody, htmlBody);
  } catch (error) {
    logger.error(error);
  }
}

async function sendRequest(ownUrl, booking, room, author) {
  try {
    // SUBJECT
    const subject = `Demande de réservation en ${room.name} par ${author.firstName} ${author.lastName}.`;

    // BODY
    const managerEmails = await getManagersEmailOfRoom(room);
    const imageExists = await doesRoomImageExists(room.id);
    const link = `${ownUrl}request/${booking.token}`;

    const htmlBody = getRequestHTMLBody(
      booking,
      room,
      author,
      subject,
      link,
      managerEmails,
      imageExists,
    );

    const plainBody = getRequestPlainBody(booking, room, author, subject);

    // SEND
    await send(managerEmails, subject, plainBody, htmlBody);
  } catch (error) {
    logger.error(error);
  }
}

module.exports = {
  sendConfirm,
  sendDecline,
  sendRequest,
};
