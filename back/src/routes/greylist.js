// lib
const express = require("express");
const R = require("ramda");
// src
const { requireAdmin } = require("../middlewares/authorize");
const Greylist = require("../models/greylist");
const { assert, schema } = require("../utils/validate");
const logger = require("../utils/logger");

const router = express.Router();

const getErrorPaths = (error) =>
  error.details.map(({ path }) => (Array.isArray(path) ? path[0] : path));

const manageError = (error, res) => {
  if (error.isJoi) {
    res.status(422).send({ paths: getErrorPaths(error) });
  }
  if (error.name === "MongoError" && error.code === 11000) {
    res.status(422).send({ paths: "name" });
  }
  res.status(500).send(error.message);
};

router.get("/", async (req, res) => {
  try {
    let greylists;
    if (req.user.adminPermissions) {
      greylists = await Greylist.getNames();
    } else {
      greylists = await Greylist.getNamesIfManager(req.user.email);
    }
    res.status(200).json(greylists);
  } catch (error) {
    logger.error(error);
    res.status(500).send(`An error occurred with greylists`);
  }
});

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const greylist = await Greylist.findBySlug(slug);
    // authorize
    if (!greylist) {
      res.sendStatus(404);
    } else if (
      !req.user.adminPermissions &&
      !greylist.managerEmails.includes(req.user.email)
    ) {
      res.sendStatus(401);
    } else {
      // send
      res.json(greylist);
    }
  } catch (error) {
    logger.error(error);
    res.status(500).send(`An error occurred with greylists`);
  }
});

const FIELDS = ["name", "roomIds", "managerEmails", "userEmails", "domains"];
const NON_ADMIN_FIELDS = ["userEmails"];

const splitAndFilter = (arr) =>
  R.filter(
    (item) => Boolean(item),
    arr.split(",").map((v) => v.trim()),
  );

const transformations = {
  roomIds: (v) => splitAndFilter(v).map((id) => parseInt(id, 10)),
  managerEmails: splitAndFilter,
  userEmails: splitAndFilter,
  domains: splitAndFilter,
};

router.post("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const greylist = await Greylist.findBySlug(slug);
    // authorize
    if (!greylist) {
      res.sendStatus(404);
    } else if (
      !req.user.adminPermissions &&
      !greylist.managerEmails.includes(req.user.email)
    ) {
      res.sendStatus(401);
    } else {
      const updateFields = req.user.adminPermissions
        ? FIELDS
        : NON_ADMIN_FIELDS;
      const rawFields = R.pick(updateFields, req.body);
      const fields = R.evolve(transformations, rawFields);
      assert(schema.modifyGreylist, fields);
      await Greylist.update(slug, fields);
      res.sendStatus(200);
    }
  } catch (error) {
    manageError(error, res);
  }
});

router.post("/", requireAdmin, async (req, res) => {
  try {
    const rawFields = R.pick(FIELDS, req.body);
    const fields = R.evolve(transformations, rawFields);
    assert(schema.addGreylist, fields);
    await Greylist.create(fields);
    res.sendStatus(200);
  } catch (error) {
    manageError(error, res);
  }
});

router.delete("/:slug", requireAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    await Greylist.deleteOne(slug);
    res.sendStatus(200);
  } catch (error) {
    manageError(error, res);
  }
});

module.exports = router;
