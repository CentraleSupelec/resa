// @flow
// lib
const express = require("express");
// src
const { requireAnnuaire } = require("../middlewares/geode");
const Admin = require("../models/admin");
const wsPerson = require("../webservice/person");
const validate = require("../utils/validate");
const logger = require("../utils/logger");

/* ::
  import type { RequestWithUser } from '../middlewares/authenticate'

  import type { UserJWT } from './login'
*/

const router = express.Router();

router.get("/", async (req /* : RequestWithUser<{}> */, res) => {
  try {
    if (!req.user.adminPermissions) {
      throw new Error("not permitted");
    }
    res.status(200).json({ admins: await Admin.getAllAdmins() });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

router.get("/verify", async (req /* : RequestWithUser<{}> */, res) => {
  try {
    res.status(200).json({ isAdmin: await Admin.isAdmin(req.user.email) });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/", requireAnnuaire, async (
  req /* : RequestWithUser<{| email: string, permissions: string[] |}> */,
  res,
) => {
  try {
    if (!req.user.adminPermissions) {
      throw new Error("not permitted");
    }
    validate.input(validate.schema.admin, req.body);

    // $FlowFixMe
    const person = await wsPerson.getPersonFromEmail(
      req.geode.annuaireClient,
      req.geode.guid,
      req.body.email,
    );

    if (
      !(await Admin.adminHasPermissions(req.user.email, req.body.permissions))
    ) {
      throw new Error("not permitted");
    }

    const admin = {
      ...person,
      email: person.email ? person.email : req.body.email,
      permissions: req.body.permissions,
      addedBy: req.user.email,
    };

    await Admin.generateAdmin(admin);

    res.status(200).json({ admins: await Admin.getAllAdmins() });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

router.delete("/:email", async (req /* : RequestWithUser<{}> */, res) => {
  try {
    if (!req.user.adminPermissions) {
      throw new Error("not permitted");
    }
    if (req.params.email === req.user.email) {
      throw new Error("Cannot remove itself");
    }
    if (
      !(await Admin.adminHasPermissions(req.user.email, [
        Admin.permissions.SUPER_ADMIN,
      ]))
    ) {
      throw new Error("don't have the rights");
    }

    await Admin.removeAdminFromEmail(req.params.email);

    res.status(200).json({ admins: await Admin.getAllAdmins() });
  } catch (error) {
    logger.error(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
