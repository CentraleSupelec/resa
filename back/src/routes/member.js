// @flow
// lib
const express = require("express");
// src
const { requireAnnuaire } = require("../middlewares/geode");
const wsPerson = require("../webservice/person");
const Member = require("../models/member");
const validate = require("../utils/validate");
const logger = require("../utils/logger");

/* ::
  import type { RequestWithUser } from "../middlewares/authenticate";
  import type { User } from "../types.flow";
*/

const router = express.Router();

// ? List of possible groups
// ? returns [{ groupId: number, label: string }]
router.get("/groups", async (req /* : RequestWithUser<> */, res) =>
  res.status(200).json(Member.groups),
);

// ? List of group of which member (identified by auth) is manager
// ? returns [{ groupId: number, label: string, members: [USER], managers: [USER] }]
router.get("/", async (req /* : RequestWithUser<> */, res) => {
  try {
    res.status(200).json(await Member.getGroupsOfManager(req.user.email));
  } catch (error) {
    logger.error(error);
    res.status(500).send(`An error occurred with groups`);
  }
});

// ? returns { groupId: number, label: string, members: [USER], managers: [USER] }
router.get("/:groupId", async (req /* : RequestWithUser<> */, res) => {
  try {
    res
      .status(200)
      .json(await Member.getGroup(parseInt(req.params.groupId, 10)));
  } catch (error) {
    logger.error(error);
    res.status(500).send(`An error occurred with group ${req.params.groupId}`);
  }
});

// ? Promote user to member or manager
// ? returns [{ groupId: number, label: string, members: [USER], managers: [USER] }]
router.post("/:groupId", requireAnnuaire, async (
  req /* : RequestWithUser<{}, {|
    userEmail: string,
    role: 'member' | 'manager' | 'main-manager',
  |}> */,
  res,
) => {
  try {
    validate.input(validate.schema.member, req.query);

    const { role, userEmail } = req.query;
    console.log(`Promote ${userEmail} to ${role}`);
    const groupId = parseInt(req.params.groupId, 10);

    if (role === "main-manager") {
      await Member.promoteMainManager(req.user.email, userEmail, groupId);
    } else if (role === "manager") {
      await Member.promoteManager(req.user.email, userEmail, groupId);
    } else {
      let user /* : User | null */ = null;
      const member = await Member.getMemberFromEmail(userEmail);
      if (member) {
        user = {
          id: member.id,
          firstName: member.firstName,
          lastName: member.lastName,
          email: member.email,
        };
      } else {
        // Fetch GEODE userId
        // is null if doesn't exist
        user = await wsPerson.getPersonFromEmail(
          req.geode.annuaireClient,
          req.geode.guid,
          userEmail,
        );
      }
      if (user === null) {
        throw new Error(`No user of email ${userEmail}`);
      }
      await Member.addNewMember(req.user.email, user, groupId);
    }
    res.status(200).json(await Member.getGroupsOfManager(req.user.email));
  } catch (error) {
    logger.error(error);
    res
      .status(500)
      .send(
        `An error occurred with user ${req.query.userEmail} in group ${req.params.groupId} with manager ${req.user.email}`,
      );
  }
});

// ? Revoke user from role
// ? returns [{ groupId: number, label: string, members: [USER], managers: [USER] }]
router.delete("/:groupId", async (
  req /* : RequestWithUser<{}, {|
    userEmail: string,
    role: 'member' | 'manager' | 'main-manager',
  |}> */,
  res,
) => {
  try {
    validate.input(validate.schema.member, req.query);

    const { role, userEmail } = req.query;
    const groupId = parseInt(req.params.groupId, 10);

    if (role === "main-manager") {
      await Member.revokeMainManager(req.user.email, userEmail, groupId);
    } else if (role === "manager") {
      await Member.revokeManager(req.user.email, userEmail, groupId);
    } else {
      await Member.removeMember(req.user.email, userEmail, groupId);
    }
    res.status(200).json(await Member.getGroupsOfManager(req.user.email));
  } catch (error) {
    logger.error(error);
    console.error(error)
    res
      .status(500)
      .send(
        `An error occurred with user ${req.query.userEmail} in group ${req.params.groupId} with manager ${req.user.email}`,
      );
  }
});

module.exports = router;
