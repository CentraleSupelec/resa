// ToDo: Add label for when use is in group

export default (room, isAlreadyBooked = false) => [
  {
    type: "roomType",
    value: room.type,
  },
  {
    type: "buildingAndCampus",
    building: room.building,
    campus: room.campus,
  },
  {
    type: "wingAndFloor",
    wing: room.wing,
    floor: room.floor,
  },
  {
    type: "capacity",
    value: room.capacity,
  },
  {
    type: "videoConference",
    value: room.videoConference,
  },
  {
    type: "videoRecording",
    value: room.videoRecording,
  },
  {
    type: "video",
    value: room.video,
  },
  {
    type: "donator",
    value: room.donator,
  },
  {
    type: "needConfirmation",
    value: !room.allowBookings,
    belongsTo: room.belongsTo,
  },
  {
    type: "notAvailable",
    value: !room.available && !isAlreadyBooked,
  },
  {
    type: "openSpace",
    value: room.openSpace,
  },
  {
    type: "modular",
    value: room.modular,
  },
];
