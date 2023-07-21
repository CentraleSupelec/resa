// @flow

import moment from "moment";

// Basic Types

// Used to store bookings waiting for a confirmation
export type Book = {
  roomId: number,
  userId: string,
  userFirstName: string,
  userLastName: string,
  userEmail: string,
  isCentraleSupelec?: boolean,
  eventName: string,
  startDate: Date,
  endDate: Date,
  token: string,
  videoProvider?: string,
  sentEmailDate: Date,
  responseDate?: Date,
  isApproved: boolean,
};

// Used to store the mapping between an event and a userEmail for non Geode users (UPSaclay)
export type Mirror = {
  eventId?: number,
  token?: string,
  userEmail: string,
  startDate: Date,
};

export type User = {|
  id: string,
  firstName: string,
  lastName: string,
  email: string,
|};

export type Room = {|
  id: number,
  name: string,
  campus: string,
  building: string,
  wing: string,
  floor: string,
  type: string,
  capacity: number,
  videoRecording: boolean,
  code: string,
  video: boolean,
  videoConference: boolean,
  audioConference: boolean,
  audio: boolean,
  liveStreaming: boolean,
  allowBookings: boolean,
  donator: string,
  openSpace: boolean,
  available?: boolean,
  belongsTo: Array<{| groupId: number, label: string |}>,
  modular: boolean,
  wifiForEducation: boolean,
  location: string,
  videoProviders: Array<{| groupId: number, label: string |}>,
  visioType: string,
  department: Array<{| groupId: number, label: string |}>,
  area: string,
  zrr: boolean,
  help: string,
|};

export type Event = {|
  id: string,
  name: string,
  local?: boolean,
  type: string | null,
  roomId: number,
  authorId: string,
  startDate: moment,
  endDate: moment,
|};

export type Membership = {|
  groupId: number,
  addedBy: string,
  isMainManager?: boolean,
|};

export type Member = {|
  ...User,
  mainManager?: Membership,
  memberOf: Array<Membership>,
  managerOf: Array<Membership>,
|};

export type SimplifiedMembership = {|
  ...User,
  addedBy: string,
|};

export type Group = {|
  label: string,
  groupId: number,
  members: SimplifiedMembership[],
  managers: SimplifiedMembership[],
|};

// Composed

export type Event_Room = {|
  ...Event,
  room: Room,
|};

export type Event_Author = {|
  ...Event,
  author: User,
|};

export type Room_Events__Author = {|
  ...Room,
  events: Event_Author[],
|};

// Specials

export type GroupedEvent_Room = Array<{|
  name: "past" | "future",
  content: Event_Room[],
|}>;
