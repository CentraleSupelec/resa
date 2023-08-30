// @flow

const express = require("express");
const moment = require("moment");
// src
const {
  requireAgenda,
  requireAgendaAnnuaire,
} = require("../middlewares/geode");
const { requireBookingPermissions } = require("../middlewares/authorize");
const Book = require("../models/book");
const wsSearch = require("../webservice/search");
const logger = require("../utils/logger");

/* ::
  import type { Request, RequestWithUser } from "../middlewares/authenticate"
  import type { Book as BookType, Room_Events__Author, Event_Author } from "../types.flow"
*/

const router = express.Router();

/*
To search available rooms, a client can go to /api/search/
A JSON object is returned with the attributes specified in the return statement
of parseRoom(room) (in webservice/utils/roomParser.js)
*/

router.get(
  "/available/:startDate/:endDate/",
  requireAgendaAnnuaire,
  requireBookingPermissions,
  async (req /* : Request<> */, res) => {
    try {
      // restricts only if not whitelisted
      const onlyRoomIds = req.permission.isWhitelisted
        ? null
        : req.permission.onlyRoomIds;
      const rooms = await wsSearch.getAvailableRooms(
        req.geode.agendaClient,
        req.geode.annuaireClient,
        req.geode.guid,
        req.params.startDate,
        req.params.endDate,
        onlyRoomIds,
      );
      const bookingRequests = await Book.getBookingRequestsBetweenDates(
        req.params.startDate,
        req.params.endDate,
      );
      const bookingRequestIDs /* : number[] */ = bookingRequests.map(
        (room) => room.roomId,
      );

      rooms.forEach((building) => {
        building.content.forEach((room) => {
          if (bookingRequestIDs.includes(room.id)) {
            // eslint-disable-next-line
            room.available = false;
          }
        });
      });

      res.status(200).json(rooms);
    } catch (error) {
      logger.error(error);
      res.sendStatus(500);
    }
  },
);

router.get(
  "/favorite/:roomId/:selectedDate/",
  requireAgendaAnnuaire,
  requireBookingPermissions,
  async (req /* : Request<> */, res) => {
    const roomId = parseInt(req.params.roomId, 10);
    //! Must send room with events and full authors in events
    //! aka Room_Events__Author
    try {
      if (
        !req.permission.isWhitelisted &&
        (!req.permission.onlyRoomIds ||
          !req.permission.onlyRoomIds.includes(roomId))
      ) {
        res.sendStatus(403);
        return;
      }

      const room /* : Room_Events__Author */ = await wsSearch.getRoomDetailWithEvents(
        req.geode.agendaClient,
        req.geode.annuaireClient,
        req.geode.guid,
        roomId,
        req.params.selectedDate,
      );

      const localRawBookings /* : BookType[] */ = await Book.getEventsInRoomAtDate(
        roomId,
        req.params.selectedDate,
      );

      const localBookings /* : Event_Author[] */ = localRawBookings.map(
        (localBooking) => {
          const booking /* : Event_Author */ = {
            // $FlowFixMe
            id: `local_${localBooking._id}`,
            local: true,
            name: localBooking.eventName,
            type: "rendez-vous",
            startDate: moment.utc(localBooking.startDate),
            endDate: moment.utc(localBooking.endDate),
            roomId: localBooking.roomId,
            authorId: localBooking.userId,
            author: {
              id: localBooking.userId,
              firstName: localBooking.userFirstName,
              lastName: localBooking.userLastName,
              email: localBooking.userEmail,
            },
          };
          return booking;
        },
      );
      room.events = room.events.concat(localBookings);
      res.status(200).json(room);
    } catch (error) {
      logger.error(error);
      res.sendStatus(500);
    }
  },
);

router.get(
  "/roomAgenda/:roomId/:startDate/:endDate/",
  requireAgendaAnnuaire,
  requireBookingPermissions,
  async (req /* : Request<> */, res) => {
    try {
      const roomId = parseInt(req.params.roomId, 10);
      if (
        !req.permission.isWhitelisted &&
        !req.permission.onlyRoomIds.includes(roomId)
      ) {
        res.sendStatus(403);
      }
      const room = (
        await wsSearch.getAvailableRooms(
          req.geode.agendaClient,
          req.geode.annuaireClient,
          req.geode.guid,
          req.params.startDate,
          req.params.endDate,
          [roomId],
        )
      )[0].content[0];

      res.status(200).json(room);
    } catch (error) {
      logger.error(error);
      res.sendStatus(500);
    }
  },
);

router.get("/roomList/", requireAgenda, async (req /* : Request<> */, res) => {
  try {
    const roomList = await wsSearch.getAllRooms(
      req.geode.agendaClient,
      req.geode.guid,
    );
    res.status(200).json(roomList);
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
