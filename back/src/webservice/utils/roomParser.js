// @flow

const config = require("../translatorConfig").room;
const misc = require("./misc");
const logger = require("../../utils/logger");

/* ::
  import type { Room } from "../../types.flow";
  import type { RawRoom } from "./translator.flow";
*/

function newTranslationError(
  propertyName,
  roomName,
  roomId,
  untranslatedValue,
) {
  // Format translation errors that will be logged to help debug configuration issues
  return new Error(
    `${propertyName} could not be translated for room ${roomName} of ID ${roomId} (property value: ${untranslatedValue}). Check translatorConfig.json file`,
  );
}

function getPropertyValue(room, propertyName) /* : any */ {
  /*
  This functions gets this room's propertyName value and translates it
  into a human-readable value if needed (using translatorConfig.json)
  */

  const translator = config[propertyName];

  const rawValue = misc.getPropertyRawValue(room, translator.CodPro);

  if (translator.valueType === "array") {
    if (rawValue === null) {
      return [];
    }
    const codes = rawValue.substring(3).split(", ");
    return codes.map((code) => translator.ValPro[code]).filter(Boolean);
  }

  // Check if rawValue is meaningful
  if (rawValue === null) return null;

  // Check if value needs translation or can be sent as is
  if (translator.ValPro === "getValueDirectly") {
    if (translator.valueType === "integer") {
      return Number(rawValue);
    }
    if (translator.valueType === "string") {
      return rawValue;
    }
    throw new Error(
      `translatorConfig.json file should specify valueType: string or integer for property ${propertyName} because "getValueDirectly" is used`,
    );
  }

  // Check if config file can translate value
  if (translator.ValPro[rawValue] === undefined) {
    logger.error(
      newTranslationError(propertyName, room.NomRes, room.NumRes, rawValue),
    );
    return null;
  }

  // Check if value needs translation from string to boolean
  if (translator.valueType === "boolean") {
    return translator.ValPro[rawValue] === "true";
  }

  // Return human-readable value
  return translator.ValPro[rawValue];
}

function parseRoom(room /* : RawRoom */) /* : Room */ {
  const parsed = {
    id: Number(room.NumRes),
    name: room.NomRes,
    videoConference: getPropertyValue(room, "videoConference"),
    videoProviders: getPropertyValue(room, "videoProviders"),
    visioType: getPropertyValue(room, "visioType"),
    campus: getPropertyValue(room, "campus"),
    building: getPropertyValue(room, "building"),
    wing: getPropertyValue(room, "wing"),
    floor: getPropertyValue(room, "floor"),
    type: getPropertyValue(room, "type"),
    capacity: getPropertyValue(room, "capacity"),
    videoRecording: getPropertyValue(room, "videoRecording"),
    code: getPropertyValue(room, "code"),
    video: getPropertyValue(room, "video"),
    audioConference: getPropertyValue(room, "audioConference"),
    audio: getPropertyValue(room, "audio"),
    liveStreaming: getPropertyValue(room, "liveStreaming"),
    allowBookings: getPropertyValue(room, "allowBookings"),
    donator: getPropertyValue(room, "donator"),
    openSpace: getPropertyValue(room, "openSpace"),
    belongsTo: getPropertyValue(room, "belongsTo"),
    modular: getPropertyValue(room, "modular"),
    wifiForEducation: getPropertyValue(room, "wifiForEducation"),
    location: getPropertyValue(room, "location"),
    department: getPropertyValue(room, "department"),
    area: getPropertyValue(room, "area"),
    help: getPropertyValue(room, "help"),
    zrr: getPropertyValue(room, "zrr"),
  };

  return parsed;
}

function parseRoomList(roomList /* : any */) /* : Room[] */ {
  // Check if there are rooms at all
  if (!roomList) {
    return [];
  }

  // Handle case when a single room is sent by GEODE: roomList needs
  // to be transformed into an array
  const arrayContent = Array.isArray(roomList) ? roomList : [roomList];

  return arrayContent
    .filter(
      (room) =>
        misc.getPropertyRawValue(room, "TYP") === config.resourceType.code,
    )
    .map(parseRoom);
}

module.exports = {
  parseRoomList,
  parseRoom,
};
