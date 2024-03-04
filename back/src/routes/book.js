// @flow
// lib
const express = require("express");
const moment = require("moment");
require("moment/locale/fr");
// search
const { AuthOrigin } = require("../config/constants");
const geodeDSMeetings = require("../geodeDS/meetings");
const { requireAgendaAnnuaire } = require("../middlewares/geode");
const Book = require("../models/book");
const Mirror = require("../models/mirror");
const Meeting = require("../models/meeting");
const Member = require("../models/member");
const wsSearch = require("../webservice/search");
const wsBook = require("../webservice/book");
const validate = require("../utils/validate");
const retryUntil = require("../utils/retryUntil");
const { sendConfirm, sendRequest } = require("../utils/email/booking");
const logger = require("../utils/logger");

/* ::
  import type { RequestWithUser } from '../middlewares/authenticate'
  import type { GroupedEvent_Room } from '../types.flow'
*/

const router = express.Router();

router.post("/add/", requireAgendaAnnuaire, async (
  req /* : RequestWithUser<{|
      eventName: string,
      startDate: string,
      endDate: string,
      roomId: number,
      videoProvider: string
    |}> */,
  res,
) => {
  /*
  Required POST parameters:
  - eventName
  - startDate
  - endDate
  - roomId
  - videoProvider

  /!\ startDate and endDate must be in ISO 8601 string format.
  */
  try {
    // Sanity check of inputs
    validate.input(validate.schema.addEvent, req.body);

    const isCentraleSupelec = req.authOrigin === AuthOrigin.CentraleSupelec;
    const author = req.user;

    // user was found, continue the booking process
    const room = await wsSearch.getRoomDetail(
      req.geode.agendaClient,
      req.geode.guid,
      req.body.roomId,
    );
    if (!room.allowBookings) {
      if (room.belongsTo.length === 0) {
        logger.error("Room need to belongs to a group that has some members");
        res.sendStatus(500);
        return;
      }
      const memberEmails = (
        await Promise.all(
          room.belongsTo.map(({ groupId }) => Member.membersOfGroup(groupId)),
        )
      )
        .reduce((acc, member) => [...acc, ...member], [])
        .map(({ email }) => email);

      // ? if user that books the room isn't a member of a room's group
      if (!memberEmails.includes(author.email)) {
        // ? Store in local db the booking that will be accepted or rejected afterwards
        const newBook = {
          roomId: room.id,
          userId: author.id,
          userFirstName: author.firstName,
          userLastName: author.lastName,
          userEmail: author.email,
          isCentraleSupelec,
          eventName: req.body.eventName,
          startDate: new Date(req.body.startDate),
          endDate: new Date(req.body.endDate),
          videoProvider: req.body.videoProvider,
          sentEmailDate: new Date(
            moment().format("YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"),
          ),
          isApproved: false,
        };
        const booking = await Book.generateBooking(newBook);
        if (!isCentraleSupelec) {
          await Mirror.generate({
            token: booking.token,
            userEmail: author.email,
            startDate: new Date(req.body.startDate),
          });
        }
        res.status(200).json({
          failedBecauseAlreadyBooked: false,
          failedBecauseMissingEmail: false,
          failedBecauseNeedPermission: true,
        });
        await sendRequest(req.ownUrl, booking, room, author);
        return;
      }
    }
    // ? Store in geode the booking
    const eventId = await retryUntil(() =>
      wsBook.addEvent(
        req.geode.agendaClient,
        req.geode.guid,
        req.body.eventName,
        author.id,
        req.body.startDate,
        req.body.endDate,
        req.body.roomId,
      ),
    );

    if (eventId === -1) {
      // room was unavailable
      res.status(200).json({
        failedBecauseAlreadyBooked: true,
        failedBecauseMissingEmail: false,
        failedBecauseNeedPermission: false,
      });
    } else {
      if (!isCentraleSupelec) {
        await Mirror.generate({
          eventId,
          userEmail: author.email,
          startDate: new Date(req.body.startDate),
        });
      }

      // booking succeeded
      let videoAccessDetails = "";
      if (
        room.videoConference &&
        Boolean(req.body.videoProvider) &&
        req.body.videoProvider !== "none"
      ) {
        // Videoconference required
        const meeting = await geodeDSMeetings.createMeeting(
          req.body.videoProvider,
          req.body.eventName,
          req.body.startDate,
          req.body.endDate,
          req.body.roomId,
        );
        if (meeting) {
          // Videoconference succeeded
          videoAccessDetails = meeting && meeting.accessDetails;
          Meeting.create({
            eventId,
            meetingId: meeting.id,
            provider: meeting.provider,
          });

          res.status(200).json({
            failedBecauseAlreadyBooked: false,
            failedBecauseMissingEmail: false,
            failedBecauseNeedPermission: false,
            videoMeetingCreated: true,
          });
        } else {
          // Videoconference failed
          res.status(200).json({
            failedBecauseAlreadyBooked: false,
            failedBecauseMissingEmail: false,
            failedBecauseNeedPermission: false,
            failedVideoMeetingCreation: true,
          });
        }
      } else {
        // No videoconference required
        res.status(200).json({
          failedBecauseAlreadyBooked: false,
          failedBecauseMissingEmail: false,
          failedBecauseNeedPermission: false,
        });
      }

      await sendConfirm(
        req.ownUrl,
        room,
        eventId,
        req.body.eventName,
        req.body.startDate,
        req.body.endDate,
        req.user,
        false,
        videoAccessDetails,
      );
    }
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

router.post("/cancel/", requireAgendaAnnuaire, async (
  req /* : RequestWithUser<{| eventId: number |}> */,
  res,
) => {
  /*
  Required POST parameters:
  - eventId
  */

  try {
    // Sanity check of inputs
    validate.input(validate.schema.cancelEvent, req.body);

    // Ensure that the user has the right to cancel this booking
    await wsBook.ensureEventBelongsToUser(
      req.geode.agendaClient,
      req.geode.guid,
      req.user.id,
      req.body.eventId,
    );

    await wsBook.cancelEvent(
      req.geode.agendaClient,
      req.geode.guid,
      req.body.eventId,
    );

    const meeting = await Meeting.findByEventId(req.body.eventId);
    if (meeting) {
      const { meetingId, provider } = meeting;
      await geodeDSMeetings.deleteMeeting(meetingId, provider);
      await Meeting.markAsDeleted(meetingId);
    }

    await Mirror.removeByEventId(req.body.eventId);

    res.sendStatus(200);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

router.post("/modify/", requireAgendaAnnuaire, async (
  req /* : RequestWithUser<{|
    eventId: number,
    newEventName: string,
    newStartDate: string,
    newEndDate: string,
    newRoomId: number,
  |}> */,
  res,
) => {
  /*
  Required POST parameters:
  - eventId
  - newEventName
  - newStartDate
  - newEndDate
  */

  try {
    // Sanity check of inputs
    validate.input(validate.schema.modifyEvent, req.body);

    // Ensure that the user has the right to modify this booking
    const event = await wsBook.ensureEventBelongsToUser(
      req.geode.agendaClient,
      req.geode.guid,
      req.user.id,
      req.body.eventId,
    );
    const room = await wsSearch.getRoomDetail(
      req.geode.agendaClient,
      req.geode.guid,
      req.body.newRoomId,
    );

    if (
      (event.startDate.toISOString() !== req.body.newStartDate ||
        event.endDate.toISOString() !== req.body.newEndDate) &&
      !room.allowBookings
    ) {
      throw new Error("Cannot modify this room");
    }

    // if success === true then modification succeeded
    // if success === false then room was unavailable at the specified time
    const success = await wsBook.modifyEvent(
      req.geode.agendaClient,
      req.geode.guid,
      req.body.eventId,
      req.body.newEventName,
      req.user.id,
      req.body.newStartDate,
      req.body.newEndDate,
      req.body.newRoomId,
    );

    res.status(200).json({ success });

    if (success) {
      await sendConfirm(
        req.ownUrl,
        room,
        req.body.eventId,
        req.body.newEventName,
        req.body.newStartDate,
        req.body.newEndDate,
        req.body.newRoomId,
        req.user,
        true,
        null, // no videoAccessDetails
      );
    }
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
