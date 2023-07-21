// @flow
// lib
const express = require("express");
// src
const { requireAgenda } = require("../middlewares/geode");

const geodeDSMeetings = require("../geodeDS/meetings");
const Book = require("../models/book");
const Meeting = require("../models/meeting");
const Mirror = require("../models/mirror");
const wsSearch = require("../webservice/search");
const wsBook = require("../webservice/book");
const { sendConfirm, sendDecline } = require("../utils/email/booking");
const logger = require("../utils/logger");
const retryUntil = require("../utils/retryUntil");

/* ::
  import type { Request, RequestWithOrigin } from '../middlewares/authenticate'
*/

const router = express.Router();

router.get("/:token", async (req /* : Request<> */, res) => {
  try {
    const booking = await Book.getBookingFromToken(req.params.token);
    res.status(200).json(booking || {});
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

router.post("/:token", requireAgenda, async (
  req /* : RequestWithOrigin<> */,
  res,
) => {
  try {
    const { token } = req.params;
    const booking = await Book.getBookingFromToken(token);

    if (!booking) {
      throw new logger.Error("No booking for this token");
    }

    const isCentraleSupelec = booking.isCentraleSupelec;

    const author = {
      id: booking.userId,
      firstName: booking.userFirstName,
      lastName: booking.userLastName,
      email: booking.userEmail,
    };

    const room = await wsSearch.getRoomDetail(
      req.geode.agendaClient,
      req.geode.guid,
      booking.roomId,
    );

    const eventId = await retryUntil(() =>
      wsBook.addEvent(
        req.geode.agendaClient,
        req.geode.guid,
        booking.eventName,
        author.id,
        // dates are already at right timezone
        booking.startDate.toISOString(),
        booking.endDate.toISOString(),
        booking.roomId,
      ),
    );

    if (eventId === -1) {
      // room was unavailable
      sendDecline(booking, room, author);
      await Book.updateApprovalFromToken(token, false);

      res.status(200).json({
        failedBecauseAlreadyBooked: true,
        failedBecauseMissingEmail: false,
        failedBecauseNeedPermission: false,
      });
    } else {
      // booking succeeded
      await Book.updateApprovalFromToken(token, true);

      if (!isCentraleSupelec) {
        await Mirror.upgradeFromTokenToEventId(token, eventId);
      }

      let videoAccessDetails;
      if (
        room.videoConference &&
        Boolean(booking.videoProvider) &&
        booking.videoProvider !== "none"
      ) {
        // Videoconference required
        const meeting = await geodeDSMeetings.createMeeting(
          booking.videoProvider,
          booking.eventName,
          booking.startDate,
          booking.endDate,
          booking.roomId,
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
        booking.eventName,
        booking.startDate,
        booking.endDate,
        author,
        false,
        videoAccessDetails,
      );
    }
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

router.delete("/:token", requireAgenda, async (req /* : Request<> */, res) => {
  try {
    const { token } = req.params;
    const booking = await Book.getBookingFromToken(token);

    if (!booking) {
      throw new logger.Error("No booking for this token");
    }

    const isCentraleSupelec = booking.isCentraleSupelec;

    const room = await wsSearch.getRoomDetail(
      req.geode.agendaClient,
      req.geode.guid,
      booking.roomId,
    );

    const author = {
      id: booking.userId,
      firstName: booking.userFirstName,
      lastName: booking.userLastName,
      email: booking.userEmail,
    };

    await Book.updateApprovalFromToken(token, false);

    if (!isCentraleSupelec) {
      await Mirror.removeByToken(token);
    }

    sendDecline(booking, room, author);

    res.status(200).json({
      failedBecauseAlreadyBooked: false,
      failedBecauseMissingEmail: false,
      failedBecauseNeedPermission: false,
    });
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
