// src
const geodeDSClient = require("./client");
const { shiftTimeZone } = require("../utils/date");

// People
const createMeeting = async (provider, title, dateStart, dateEnd, room) => {
  try {
    const client = await geodeDSClient.get();
    const dateStartUTC = shiftTimeZone(new Date(dateStart));
    const dateEndUTC = shiftTimeZone(new Date(dateEnd));
    console.log("[Geode DS] call to meetings with", {
      provider,
      title,
      dateStart: dateStartUTC,
      dateEnd: dateEndUTC,
      room,
    });
    const { body } = await client.post("meetings", {
      json: {
        provider,
        title,
        dateStart: dateStartUTC,
        dateEnd: dateEndUTC,
        room, // 654 // useful when using bacasable but geode ds preprod in dev 126 eiffel?
      },
      responseType: "json",
    });
    return body;
  } catch (e) {
    // returns no meeting info
    console.error("[Geode DS] meeting creation error: ", e.response.body);
    return null;
  }
};

const deleteMeeting = async (meetingId, provider) => {
  const client = await geodeDSClient.get();
  return client.delete("meetings", {
    json: {
      id: meetingId,
      provider,
    },
    responseType: "json",
  });
};

module.exports = { createMeeting, deleteMeeting };
