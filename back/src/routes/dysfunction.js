// @flow
// lib
const express = require("express");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
// src
const config = require("../config");
const { requireAgenda } = require("../middlewares/geode");
const { authenticate } = require("../middlewares/authenticate");
const Dysfunction = require("../models/dysfunction");
const wsSearch = require("../webservice/search");
const validate = require("../utils/validate");
const { sendReport } = require("../utils/email/dysfunction");
const logger = require("../utils/logger");

/* ::
  import type { Request, RequestWithUser } from "../middlewares/authenticate"
*/

const router = express.Router();

router.get("/", async (req /* : Request<> */, res) => {
  try {
    res
      .status(200)
      .json({ dysfunctions: await Dysfunction.getAllDysfunctions() });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", authenticate, async (
  req /* : RequestWithUser<{|
    emailDelegate: string,
    name: string,
    icon: string,
    actionCode?: string,
  |}> */,
  res,
) => {
  try {
    validate.input(validate.schema.dysfunction, req.body);

    const dysfunction = {
      emailDelegate: req.body.emailDelegate,
      name: req.body.name,
      icon: req.body.icon,
      actionCode: req.body.actionCode,
    };
    await Dysfunction.generateDysfunction(req.user.email, dysfunction);

    res
      .status(200)
      .json({ dysfunctions: await Dysfunction.getAllDysfunctions() });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

router.put("/", authenticate, async (
  req /* : RequestWithUser<{
    emailDelegate: string,
    name: string,
    icon: string,
    actionCode?: string,
  }> */,
  res,
) => {
  try {
    validate.input(validate.schema.dysfunction, req.body);

    const dysfunction = {
      emailDelegate: req.body.emailDelegate,
      name: req.body.name,
      icon: req.body.icon,
      actionCode: req.body.actionCode,
    };
    await Dysfunction.updateDysfunction(req.user.email, dysfunction);

    res
      .status(200)
      .json({ dysfunctions: await Dysfunction.getAllDysfunctions() });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

router.post("/reorder", async (
  req /* : Request<{|
    order: string[]
  |}> */,
  res,
) => {
  const output = { order: [], invalidOrders: false };
  try {
    try {
      validate.input(validate.schema.reorderDysfunction, req.body);
      output.order = await Dysfunction.updateOrder(req.body.order);
    } catch (e) {
      output.invalidOrders = true;
      throw e;
    }
    res.json(output);
  } catch (error) {
    logger.error(error);
    res.status(500).json(output);
  }
});

router.post("/report", requireAgenda, async (
  req /* : Request<{|
    roomId: number,
    email: string,
    comment: string,
    dysfunctions: string[],
  |}, {|
    jwtToken: string,
  |}> */,
  res,
) => {
  const output = {
    roomDoesntExist: false,
  };
  try {
    validate.input(validate.schema.reportDysfunction, req.body);

    const { jwtToken } = req.query;
    const email /* : string */ = await promisify(jwt.verify)(
      jwtToken,
      config.jwt.secret,
    )
      .then((user) => user.email)
      .catch(() => req.body.email);
    const emailDeletages = await Dysfunction.getDelegatesFromNames(
      req.body.dysfunctions,
    );

    let room;
    try {
      room = await wsSearch.getRoomDetail(
        req.geode.agendaClient,
        req.geode.guid,
        req.body.roomId,
      );
    } catch (e) {
      output.roomDoesntExist = true;
      throw new Error("Room doesn't exist");
    }

    sendReport(
      room,
      email,
      req.body.comment,
      req.body.dysfunctions,
      emailDeletages,
    );
    res.status(200).json(output);
  } catch (error) {
    logger.error(error);
    res.status(500).json(output);
  }
});

router.delete("/:name", authenticate, async (
  req /* : RequestWithUser<{||}> */,
  res,
) => {
  try {
    await Dysfunction.removeDysfunctionFromName(
      req.user.email,
      req.params.name,
    );
    res
      .status(200)
      .json({ dysfunctions: await Dysfunction.getAllDysfunctions() });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
