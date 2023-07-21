// lib
const express = require("express");
const R = require("ramda");
// src
const Setting = require("../models/setting");
const { assert, schema } = require("../utils/validate");
const logger = require("../utils/logger");

const router = express.Router();

const getErrorPaths = (error) =>
  error.details.map(({ path }) => (Array.isArray(path) ? path[0] : path));

const manageError = (error, res) => {
  if (error.isJoi) {
    res.status(422).send({ paths: getErrorPaths(error) });
  }
  res.status(500).send(error.message);
};

router.get("/", async (req, res) => {
  try {
    const whitelist = await Setting.getWhitelist();
    const domains = whitelist ? whitelist.value : "";
    res.status(200).json({ domains });
  } catch (error) {
    logger.error(error);
    res.status(500).send(`An error occurred with whitelists`);
  }
});

const FIELDS = ["domains"];

const splitAndFilter = (arr) =>
  R.filter(
    (item) => Boolean(item),
    arr.split(",").map((v) => v.trim()),
  );

const transformations = {
  domains: splitAndFilter,
};

router.post("/", async (req, res) => {
  try {
    const rawFields = R.pick(FIELDS, req.body);
    const fields = R.evolve(transformations, rawFields);
    assert(schema.modifyWhitelist, fields);
    await Setting.updateWhitelist(fields.domains.join(","));
    res.sendStatus(200);
  } catch (error) {
    manageError(error, res);
  }
});

module.exports = router;
