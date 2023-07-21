// @flow
// lib
const moment = require("moment");
const flatten = require("lodash/flatten");
// src
const config = require("../translatorConfig").event;
const misc = require("./misc");
const logger = require("../../utils/logger");

function compareStartDate(event1, event2) {
  return event1.startDate.isSameOrAfter(event2.startDate) ? 1 : -1;
}

function getEventType(event) {
  // Translates event type to human-readable value using translatorConfig.json
  return config.type[event.TypEve] === undefined
    ? null
    : config.type[event.TypEve];
}

/* ::
  import type { Event } from "../../types.flow"
  import type { RawEvent } from "./translator.flow"
*/
function parseEvent(
  event /* : RawEvent */,
  requiredRoomIds /* : number[] */,
) /* : Event[] */ {
  // Build Date objects startDate and endDate
  const startTime = misc.getPropertyRawValue(event, config.startTime.CodPro);
  const endTime = misc.getPropertyRawValue(event, config.endTime.CodPro);
  const date = misc.getPropertyRawValue(event, config.date.CodPro);

  const authorId = misc.getPropertyRawValue(event, config.author.CodPro);
  const roomIds = misc
    .getPropertyRawValues(event, config.resource.CodPro)
    .map((roomId) => Number(roomId))
    .filter(
      (roomId) =>
        requiredRoomIds.length === 0 || requiredRoomIds.includes(roomId),
    );

  if (
    startTime === null ||
    endTime === null ||
    date === null ||
    authorId === null ||
    roomIds.length === 0
  ) {
    logger.warn(
      `There is an empty field in Event ${event.NomEve} (${
        event.NumEve
      }), check in Geode.
      Received values: {
        startTime: ${startTime || ""}
        endTime: ${endTime || ""}
        date: ${date || ""}
        authorId: ${authorId || ""}
        roomIds: ${roomIds.join(",")}
      }
      Raw values: ${JSON.stringify(event)}

      `,
    );
    return [];
  }

  const startDate = moment.utc(`${date}T${startTime}`);
  const endDate = moment.utc(`${date}T${endTime}`);

  return roomIds.map((roomId) => ({
    id: event.NumEve,
    name: event.NomEve,
    type: getEventType(event),
    // ComEve: never figured out the meaning of this GEODE field
    roomId,
    authorId,
    startDate,
    endDate,
  }));
}

function parseEventList(
  eventList /* : any */,
  requiredRoomIds /* : number[] */,
) /* : Event[] */ {
  // Check if there are events at all
  if (!eventList) {
    return [];
  }

  // Handle case when a single event is sent by GEODE: eventList needs
  // to be transformed into an array
  const arrayContent /* : any[] */ = Array.isArray(eventList)
    ? eventList
    : [eventList];

  return flatten(
    arrayContent
      .filter((event) => event.EtaEve === config.active) // Only keep active events
      .map((rawEvent) => parseEvent(rawEvent, requiredRoomIds)),
  ).sort(compareStartDate); // Sort events by chronological order
}

module.exports = {
  parseEventList,
  parseEvent,
};
