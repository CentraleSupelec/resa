// @flow

const express = require("express");
// src
const { AuthOrigin } = require("../config/constants");
const {
  requireAnnuaire,
  requireAgendaAnnuaire,
} = require("../middlewares/geode");
const Greylist = require("../models/greylist");
const Member = require("../models/member");
const Mirror = require("../models/mirror");
const wsBook = require("../webservice/book");
const wsPerson = require("../webservice/person");
const logger = require("../utils/logger");

/* ::
  import type { Request, RequestWithUser } from "../middlewares/authenticate"
*/

const router = express.Router();

// ? My memberships and ownerships
// ? returns Member
router.get("/me", async (req /* : RequestWithUser<> */, res) => {
  try {
    // $FlowFixMe
    const meDoc = await Member.getMemberFromEmail(req.user.email);
    const me = meDoc ? meDoc.toObject() : {};
    const greylistManagerOf = await Greylist.getNamesIfManager(req.user.email);
    const data = {
      ...me,
      greylistManagerOf,
    };
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/bookings", requireAgendaAnnuaire, async (
  req /* : RequestWithUser<{}> */,
  res,
) => {
  //! renvoie { eventList: [{ name: string, content: Event_Room }]}
  const isCentraleSupelec = req.authOrigin === AuthOrigin.CentraleSupelec;
  try {
    let onlyIds = null;
    let onlyTokens = null;
    if (!isCentraleSupelec) {
      const only = await Mirror.getForUser(req.user.email);
      onlyIds = only.eventIds;
      onlyTokens = only.tokens;
    }
    // Fetch and format this person's events
    const eventList = await wsBook.getStapledPersonEventList(
      req.geode.agendaClient,
      req.geode.annuaireClient,
      req.geode.guid,
      req.user.id,
      req.user.email,
      onlyIds,
      onlyTokens,
    );
    res.status(200).json({ eventList });
  } catch (error) {
    logger.error(error);
    res.sendStatus(500);
  }
});

router.get("/search/:email", requireAnnuaire, async (
  req /* : RequestWithUser<{}> */,
  res,
) => {
  try {
    // Fetch GEODE userId using firstName and lastName given by CAS
    // is null if doesn't exist
    const person = await wsPerson.getPersonFromEmail(
      req.geode.annuaireClient,
      req.geode.guid,
      req.params.email,
    );
    res.status(200).json({ person });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
