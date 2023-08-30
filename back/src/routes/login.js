// @flow

const { promisify } = require("util");
const express = require("express");
const jwt = require("jsonwebtoken");
// src
const config = require("../config");
const { AuthOrigin } = require("../config/constants");
const { requireAnnuaire } = require("../middlewares/geode");
const Admin = require("../models/admin");
const wsPerson = require("../webservice/person");
const logger = require("../utils/logger");
const casService = require("../cas");
const Greylist = require("../models/greylist");
const User = require("../models/user");

/* ::
  import type { RequestWithOrigin } from '../middlewares/authenticate'
*/

const router = express.Router();

/* ::
  export type UserJWT = {
    firstName: string,
    lastName: string,
    email: string,
    geodeEmail: string,
    id: string,
    adminPermissions?: string,
  }
*/

router.get("/:token", requireAnnuaire, async (
  req /* : RequestWithOrigin<> */,
  res,
) => {
  const isCentraleSupelec = req.authOrigin === AuthOrigin.CentraleSupelec;
  // Choose cas
  const cas = isCentraleSupelec ? config.defaultCas : config.altCas;

  try {
    // Ask CAS if the token sent by the front is valid
    const casRes = await casService.validateTicket(cas, req.params.token);

    // Handle errors
    if (!casRes || !casRes.serviceResponse) {
      throw new Error("CAS Response is not a correct XML");
    } else if (!casRes.serviceResponse.authenticationSuccess) {
      throw new Error("Authentication failed");
    }

    // Build userInfo for later use
    const rawUser = casRes.serviceResponse.authenticationSuccess[0];
    const attributes = rawUser.attributes[0];
    let userInfo /* : UserJWT */;
    if (attributes.surname !== undefined) {
      // CS format
      userInfo = {
        firstName: attributes.givenname[0],
        lastName: attributes.surname[0],
        email: rawUser.user[0],
        geodeEmail: "",
        id: "",
      };
    } else if (attributes.sn !== undefined && !isCentraleSupelec) {
      // UPSaclay format
      userInfo = {
        firstName: attributes.givenName[0],
        lastName: attributes.sn[0],
        email: attributes.mail[0],
        geodeEmail: attributes.mail[0],
        id: config.altGeodeId,
      };
    } else {
      // fallback
      const fullName = attributes.simpleName[0].split(" ");
      userInfo = {
        firstName: fullName[0],
        lastName: fullName.slice(1).join(" "),
        email: attributes.email[0],
        geodeEmail: "",
        id: "",
      };
    }

    const admin = await Admin.getAdminFromEmail(userInfo.email);
    if (admin) {
      userInfo.adminPermissions = admin.permissions.join(" ");
    }

    if (isCentraleSupelec) {
      // Fetch GEODE userId using firstName and lastName given by CAS
      // $FlowFixMe
      const geodeUser = await wsPerson.getPersonFromEmail(
        req.geode.annuaireClient,
        req.geode.guid,
        userInfo.email,
      );
      if (!geodeUser || geodeUser.id === -1) {
        return res.sendStatus(401);
      }
      userInfo.id = geodeUser.id;
      userInfo.geodeEmail = geodeUser.email;
    }

    const isWhitelisted = await User.isUserWhitelisted(userInfo.email);
    if (!isWhitelisted) {
      const onlyRoomIds = await Greylist.findRoomIdsForUser(userInfo.email);
      // if not admin and can not book anything, denies login
      if (!admin && (!onlyRoomIds || onlyRoomIds.length === 0))
        return res.sendStatus(403);
    }

    // Create JWT token
    const jwtToken = await promisify(jwt.sign)(userInfo, config.jwt.secret);

    // Validate login
    return res.status(200).json(jwtToken);
  } catch (error) {
    logger.error(error);
    return res.sendStatus(401);
  }
});

module.exports = router;
