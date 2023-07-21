// @flow
// lib
const express = require("express");
const moment = require("moment");
// src
const { requireAgendaAnnuaire } = require("../middlewares/geode");
const wsSearch = require("../webservice/search");
const logger = require("../utils/logger");
const Book = require("../models/book");

/* ::
  import type { Request } from "../middlewares/authenticate"
  import type { Book as BookType, Room_Events__Author, Event_Author } from "../types.flow"
*/

const router = express.Router();

router.get("/detail/:roomId/:selectedDate/", requireAgendaAnnuaire, async (
  req /* : Request<> */,
  res,
) => {
  //! Must send room with events and full authors in events
  //! aka Room_Events__Author
  try {
    const room /* : Room_Events__Author */ = await wsSearch.getRoomDetailWithEvents(
      req.geode.agendaClient,
      req.geode.annuaireClient,
      req.geode.guid,
      Number(req.params.roomId),
      req.params.selectedDate,
    );

    const localRawBookings /* : BookType[] */ = await Book.getEventsInRoomAtDate(
      Number(req.params.roomId),
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
});

module.exports = router;
