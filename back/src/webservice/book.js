// @flow
// lib
const { promisify } = require("util");
const groupBy = require("lodash/groupBy");
const moment = require("moment");
const R = require("ramda");
// src
const eventConfig = require("./translatorConfig").event;
const wsSearch = require("./search");
const wsEventStapler = require("./eventStapler");
const eventParser = require("./utils/eventParser");
const Book = require("../models/book");
const misc = require("./utils/misc");
const retryUntil = require("../utils/retryUntil");
const { awaitAndFilter } = require("../utils/list");

/* ::
  import type { AgendaClient, AnnuaireClient} from "./connect"
  import type { Room, Event, Event_Room, Room_Events__Author } from "../types.flow"
*/

// Required by GEODE
const eventType = "RDV";

async function addEvent(
  agendaClient /* : AgendaClient */,
  guid /* : number */,
  eventName /* : string */,
  authorId /* : string */,
  startDate /* : string */,
  endDate /* : string */,
  resourceId /* : number */,
) /* : Promise<number> */ {
  // startDate and endDate must be ISO string dateTime objects

  // addEvent returns the room id if booking succeeded, -1 if room was unavailable,
  // and throws an error if some other error occured

  const response = await promisify(
    agendaClient.AjouterEvenementAvecContraintes,
  )({
    guid,
    nomEve: eventName,
    typeEve: eventType,
    statut: eventConfig.active,
    idAuteur: authorId,
    dateDebut: startDate,
    dateFin: endDate,
    participantsSouhaites: authorId.toString(),
    participantsObligatoires: "",
    formateurs: "",
    apprenants: "",
    organismes: "",
    // ajouter ressource visio au cas ou
    ressources: resourceId.toString(),
  });

  const result = response.AjouterEvenementAvecContraintesResult;

  if (result.IdEvenement !== undefined) {
    return result.IdEvenement;
  }
  if (result.ERREUR !== undefined) {
    throw new Error(result.ERREUR);
  } else if (result.ROOT.INDISPO) {
    return -1;
  } else {
    throw new Error(`an unknown error occured while creating event`);
  }
}

async function cancelEvent(
  agendaClient /* : AgendaClient */,
  guid /* : number */,
  eventId /* : number */,
) {
  return retryUntil(async () => {
    // TODO: prevent cancelling of ended events
    const response = await promisify(agendaClient.SupprimerEvenement)({
      guid,
      idEve: eventId,
    });

    if (
      !response.SupprimerEvenementResult.IdEvenement ||
      response.SupprimerEvenementResult.IdEvenement !== eventId.toString()
    ) {
      throw new Error(
        `Failed to cancel event: ${response.SupprimerEvenementResult.ERREUR}`,
      );
    }
  });
}

async function modifyEvent(
  agendaClient /* : AgendaClient */,
  guid /* : number */,
  eventId /* : number */,
  newEventName /* : string */,
  authorId /* : string */,
  newStartDate /* : string */,
  newEndDate /* : string */,
  resourceId /* : number */,
) {
  return retryUntil(async () => {
    const response = await promisify(
      agendaClient.ModifierEvenementAvecContraintes,
    )({
      guid,
      idEve: eventId,
      nomEve: newEventName,
      typeEve: eventType,
      statut: eventConfig.active,
      idAuteur: authorId,
      dateDebut: newStartDate,
      dateFin: newEndDate,
      participantsSouhaites: authorId.toString(),
      participantsObligatoires: "",
      formateurs: "",
      apprenants: "",
      organismes: "",
      ressources: resourceId.toString(),
    });

    const result = response.ModifierEvenementAvecContraintesResult;

    if (!result.IdEvenement || result.IdEvenement !== eventId.toString()) {
      if (result.ROOT && result.ROOT.INDISPO) {
        // Tell upper function that room is unavailable at the specified time
        return false;
      }
      throw new Error(`Failed to modify event: ${result.ERREUR}`);
    }
    // Tell upper function that modification was a success
    return true;
  });
}

async function addRoomToEvent(
  agendaClient /* : AgendaClient */,
  guid /* : number */,
  event,
) {
  const room = await wsSearch.getRoomDetail(agendaClient, guid, event.roomId);
  const newEvent /* : Event_Room */ = {
    ...event,
    room,
  };
  return newEvent;
}

function isEventPastOrFuture(
  event /* : Event_Room */,
) /* : "future" | "past" */ {
  if (event.endDate.isSameOrAfter(moment())) return "future";
  return "past";
}

async function getPersonEventList(
  agendaClient /* : AgendaClient */,
  guid,
  personId,
  dateDebut,
) {
  /*
  Returns a person's events
  Raw because unparsed
  */
  const response = await retryUntil(() =>
    promisify(agendaClient.ListerEvenementsAvecFiltres)({
      guid,
      dateDebut,
      listeSouhaites: personId.toString(),
      listeStatuts: eventConfig.active,
      toutesReccurences: false,
      inclureApprenants: false,
      inclureFormateurs: false,
      inclureOrganismes: false,
      inclureRessources: true,
    }),
  );
  const eventList = misc.readXML(response.ListerEvenementsAvecFiltresResult);
  return eventParser
    .parseEventList(eventList.ROOT.EVE, [])
    .filter((event) => event.authorId === personId.toString());
}

async function getStapledPersonEventList(
  agendaClient /* : AgendaClient */,
  annuaireClient /* : AnnuaireClient */,
  guid /* : number */,
  personId /* : string */,
  userEmail /* : string */,
  onlyIds /* : Array<number> | null */ = null,
  onlyTokens /* : Array<string> | null */ = null,
) {
  const eventList = await getPersonEventList(
    agendaClient,
    guid,
    personId,
    moment().subtract(3, "months").format("YYYYMMDD"),
  );
  const subsetList = onlyIds
    ? R.filter(({ id }) => onlyIds.includes(parseInt(id, 10)), eventList)
    : eventList;

  const localEventList = await Book.getLocalEventsStapledPerson(userEmail);
  const subsetLocalList = onlyTokens
    ? R.filter(({ token }) => onlyTokens.includes(token), localEventList)
    : localEventList;

  /*
        event list = [ 'id',
        'name',
        'type',
        'roomId',
        'authorId',
        'startDate', moment
        'endDate' ] moment
        */

  /*
        local list = [ 'id',
        'local',
        'name',
        'type',
        'roomId',
        'authorId',
        'startDate', moment
        'endDate' ]  moment
        */

  // Staple rooms with events
  // This allows the front-end to show the room details in a user's bookings list
  let parsedEvents /* : Event_Room[] */ = await awaitAndFilter(
    [...subsetList, ...subsetLocalList].map((event) =>
      addRoomToEvent(agendaClient, guid, event),
    ),
  );

  // Filter out unwanted events
  parsedEvents = parsedEvents
    .filter((event) => event.room !== null) // Filter out events about rooms that don't exist anymore in GEODE
    .filter((event) => event.endDate.isAfter(moment().subtract(3, "months"))); // Filter out past bookings older than 3 months old

  parsedEvents.sort(
    (eventA, eventB) => eventA.startDate.valueOf() - eventB.startDate.valueOf(),
  );

  // Group past and future events separately
  const groupedParsedEvents /* : { [key: "future" | "past" ]: Event_Room[] } */ = groupBy(
    parsedEvents,
    isEventPastOrFuture,
  );
  if (groupedParsedEvents.past) {
    groupedParsedEvents.past = groupedParsedEvents.past.reverse(); // Past event are sorted from most recent to oldest
  }
  const groupedStapleToBookingList = {};

  // Staple bookings of other people
  // This allows the front-end to show the list of events when trying to modify
  // the chosen hours
  if (groupedParsedEvents.future !== undefined) {
    // if there are future bookings
    groupedStapleToBookingList.future = await wsEventStapler.stapleToBookingList(
      agendaClient,
      annuaireClient,
      guid,
      groupedParsedEvents.future,
    );
  }

  // Convert to an array
  // $FlowFixMe
  const groupedEvents = misc.convertToArray(groupedParsedEvents);

  // Show future events before past events
  groupedEvents.reverse();

  return groupedEvents;
}

async function ensureEventBelongsToUser(
  agendaClient /* : AgendaClient */,
  guid /* : number */,
  personId /* : string */,
  eventId /* : number */,
) {
  /*
  Throws an error if eventId is not in the list of a user's events, that is to
  say if a user does not have the right to modify/cancel this booking
  */
  const eventList = await getPersonEventList(agendaClient, guid, personId);
  const event = eventList.find((eventItem) => eventItem.id === eventId);

  // if unauthorized
  if (!event) {
    throw new Error(
      `Unauthorized booking modification/cancelling attempt: event #${eventId} does not belong to user #${personId}`,
    );
  }
  return event;
}

module.exports = {
  addEvent,
  cancelEvent,
  modifyEvent,
  getStapledPersonEventList,
  ensureEventBelongsToUser,
};
