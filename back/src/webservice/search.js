// @flow

const { promisify } = require("util");
const _ = require("lodash");
const kleur = require("kleur");
// src
const config = require("./translatorConfig").room;
const wsEventStapler = require("./eventStapler");
const roomParser = require("./utils/roomParser");
const misc = require("./utils/misc");
const retryUntil = require("../utils/retryUntil");
const logger = require("../utils/logger");

/* ::
  import type { AgendaClient, AnnuaireClient } from "./connect";
  import type { Room, Event, User } from "../types.flow";
*/

async function getAllRooms(
  agendaClient /* : AgendaClient */,
  guid /* : number */,
) {
  const response = await retryUntil(() =>
    promisify(agendaClient.ListerRessources)({ guid }),
  );
  const resourceList = misc.readXML(response.ListerRessourcesResult);

  // $FlowFixMe
  return roomParser.parseRoomList(resourceList.ROOT.RES);
}

async function getRoomDetail(
  agendaClient /* : AgendaClient */,
  guid /* : number */,
  roomId /* : number */,
) {
  try {
    const response = await retryUntil(() =>
      promisify(agendaClient.DetailRessource)({
        guid,
        idRessource: roomId,
      }),
    );
    const resource = misc.readXML(response.DetailRessourceResult);
    if (resource.RES !== undefined) {
      // $FlowFixMe
      return roomParser.parseRoom(resource.RES);
    }
    throw new logger.Error("Unknown room");
  } catch (e) {
    logger.error(e);
    console.error(kleur.magenta(`getRoomDetail: guid:${guid}, id:${roomId}`));
    throw e;
  }
}

async function getRoomDetailWithEvents(
  agendaClient /* : AgendaClient */,
  annuaireClient /* : AnnuaireClient */,
  guid /* : number */,
  idRessource /* : number */,
  selectedDate /* : string */,
) {
  const room = await getRoomDetail(agendaClient, guid, idRessource);
  // format
  room.videoProviders = room.videoProviders.map(({ label }) => label);
  const roomWithEvents = (
    await wsEventStapler.stapleToRoomList(
      agendaClient,
      annuaireClient,
      guid,
      [room],
      selectedDate,
    )
  )[0];
  return roomWithEvents;
}

async function getAvailableRoomIds(
  agendaClient /* : AgendaClient */,
  guid /* : number */,
  startDate,
  endDate,
) /* : Promise<number[]> */ {
  /*
  Returns an array of roomId of available rooms: [id1, id2, ...]

  startDate and endDate must be in ISO 8601 string format.
  To convert a date object to an ISO 8601 string, use : date.toISOString()
  */

  // Get all categories
  const categorieRes = Object.keys(config.treeLocation).join(",");
  const response = await retryUntil(() =>
    promisify(agendaClient.ListerRessourcesPourPeriode)({
      guid,
      typeRes: config.resourceType.code,
      categorieRes,
      dateDebut: startDate,
      dateFin: endDate,
    }),
  );

  return response.ListerRessourcesPourPeriodeResult.Root.Res.map((room) =>
    Number(room.NumRes),
  );
}

function compareCapacity(room1, room2) {
  if (Number(room1.capacity) > Number(room2.capacity)) {
    return 1;
  }
  if (Number(room1.capacity) < Number(room2.capacity)) {
    return -1;
  }
  return 0;
}

async function getAvailableRooms(
  agendaClient /* : AgendaClient */,
  annuaireClient /* : AnnuaireClient */,
  guid /* : number */,
  startDate /* : string */,
  endDate /* : string */,
  // If only looking for the result for one particular room, filter by this room ID:
  onlyRoomIds /* : Array<number> | null */ = null,
) /* : Promise<Array<{name: string, content: Room[]}>> */ {
  /*
  startDate and endDate must be in ISO 8601 string format.
  To convert a date object to an ISO 8601 string, use : date.toISOString()
  */

  const rooms = await getAllRooms(agendaClient, guid);
  const availableIds = await getAvailableRoomIds(
    agendaClient,
    guid,
    startDate,
    endDate,
  );

  const subset =
    onlyRoomIds !== null && onlyRoomIds.length
      ? rooms.filter((room) => onlyRoomIds.includes(room.id))
      : rooms;

  const filteredRooms = subset
    // Filter out rooms that are not allowed for booking
    .filter(
      (room) =>
        room.allowBookings ||
        (!room.allowBookings && room.belongsTo.length > 0),
    )
    .map((room) => ({
      ...room,
      videoProviders: room.videoProviders.map((vp) => vp.label),
      // Add an 'available' property to say if the room is available at the specified timespan
      available: availableIds.indexOf(room.id) !== -1,
    }))
    // Sort by capacity
    .sort(compareCapacity);

  const roomsWithEvents = await wsEventStapler.stapleToRoomList(
    agendaClient,
    annuaireClient,
    guid,
    filteredRooms,
    startDate,
  );

  // Group by building
  // $FlowFixMe
  return misc.convertToArray(_.groupBy(roomsWithEvents, "building"));
}

module.exports = {
  getRoomDetail,
  getRoomDetailWithEvents,
  getAllRooms,
  getAvailableRooms,
};
