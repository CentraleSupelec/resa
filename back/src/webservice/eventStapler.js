// @flow
// lib
const { promisify } = require("util");
const _ = require("lodash");
const moment = require("moment");
require("moment/locale/fr");
// src
const misc = require("./utils/misc");
const wsPerson = require("./person");
const eventParser = require("./utils/eventParser");
const retryUntil = require("../utils/retryUntil");

/* ::
  import type { AgendaClient, AnnuaireClient } from "./connect";
  import type { User, Room, Event, Event_Room, Event_Author, Room_Events__Author } from "../types.flow"
*/

async function getRoomEventList(
  agendaClient /* : AgendaClient */,
  guid /* : number */,
  roomList,
  selectedDate,
) {
  // roomList must be an array of integers: [roomId1, roomId2, roomId3, ...]
  // selectedDate must be in ISO 8601 string format

  // Convert selectedDate in YYYYMMDD string format because GEODE requires it
  const formattedDate = moment(selectedDate).utc().format("YYYYMMDD");
  const response = await retryUntil(() =>
    promisify(agendaClient.ListerEvenementsAvecFiltres)({
      guid,
      dateDebut: formattedDate,
      dateFin: formattedDate,
      // GEODE only accepts listeRessources as a string like "roomId1,roomId2,..."
      listeRessources: roomList.join(","),
      toutesReccurences: false,
      inclureApprenants: false,
      inclureFormateurs: false,
      inclureOrganismes: false,
      inclureRessources: true,
    }),
  );
  const eventList = misc.readXML(response.ListerEvenementsAvecFiltresResult);
  return eventParser.parseEventList(eventList.ROOT.EVE, roomList);
}

function stapleRoomEventsUsers(
  room /* : Room */,
  events /* : Event[] */,
  users,
) /* : Room_Events__Author */ {
  /*
  events is an array of events for multiple rooms
  This function extract the events for this specific room,
  and returns a new room object with an "events" attribute
  */

  // Duplicate room object to avoid parameters reassignment
  const roomWithEvents /* : Room_Events__Author */ = {
    ...room,
    events: events
      .filter((event) => event.roomId === room.id)
      .map((event) => {
        // Add author details to event
        const eventWithAuthor /* : Event_Author */ = {
          ...event,
          author: _.find(users, ["id", event.authorId]),
        };

        return eventWithAuthor;
      }),
  };

  // Find the events for this specific room
  return roomWithEvents;
}

async function stapleToRoomList(
  agendaClient /* : AgendaClient */,
  annuaireClient /* : AgendaClient */,
  guid /* : number */,
  rooms /* : Room[] */,
  selectedDate /* : string | Date | moment */,
) /* : Promise<Room_Events__Author[]> */ {
  /*
  This functions takes in argument an array of rooms (formatted by roomParser)
  and returns a similar array, with an additional "events" property on each
  room of the array. This events property contains an array of events
  (formatted by eventParser). For each event, the user who made the booking is
  available in an "author" property.
  */

  // Download events for the selected date to rooms
  const events = await getRoomEventList(
    agendaClient,
    guid,
    rooms.map((room) => room.id),
    selectedDate,
  );

  // Get details (name, email...) of users who booked a room for the selected date
  const users = (
    await Promise.all(
      _.uniq(events.map((event) => event.authorId)).map((authorId) =>
        wsPerson
          .getPersonDetailsFromId(annuaireClient, guid, authorId)
          .catch(() => null),
      ),
    )
  ).filter(Boolean);

  // Staple events and users to rooms
  return rooms.map((room) => stapleRoomEventsUsers(room, events, users));
}

function stapleToBookingList(
  agendaClient /* : AgendaClient */,
  annuaireClient /* : AnnuaireClient */,
  guid /* : number */,
  bookingList /* : Event_Room[] */,
) {
  /*
  This functions serves the same purpose as stapleToRoomList(), but for a
  list of bookings (thus with variable dates to look for events)
  */

  return Promise.all(
    bookingList.map(async (booking) => {
      // Duplicate room object to avoid parameters reassignment
      const rooms /* : Room_Events__Author[] */ = await stapleToRoomList(
        agendaClient,
        annuaireClient,
        guid,
        [booking.room],
        booking.startDate,
      );

      const { events, ...room } = rooms[0];

      const newBooking /* : Event_Room */ = {
        ...booking,
        room,
      };

      return newBooking;
    }),
  );
}

module.exports = { stapleToRoomList, stapleToBookingList };
