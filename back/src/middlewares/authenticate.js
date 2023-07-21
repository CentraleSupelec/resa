// @flow
// lib
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
// src
const config = require("../config");
const { AuthOrigin } = require("../config/constants");
const logger = require("../utils/logger");

/* ::
  import type { Middleware, $Request } from 'express'
  import type { UserJWT } from '../routes/login'
  import type { GeodeClient } from '../webservice/connect'

  export type Permission = {
    isWhitelisted: boolean,
    onlyRoomIds: Array<number>,
  }

  export type Request<Body = {}, Query = {}> = {| body: Body, query: Query, geode: GeodeClient |} & $Request & {| permission: Permission |}
  export type RequestWithUser<Body = {}, Query = {}> = {| body: Body, query: {| ...Query, jwtToken: string |} |} & $Request & {| user: UserJWT, authOrigin: number, ownUrl: string, geode: GeodeClient |}
  export type RequestWithOrigin<Body = {}, Query = {}> = {| body: Body, query: {| ...Query, jwtToken: string |} |} & $Request & {| authOrigin: number, ownUrl: string, geode: GeodeClient |}
*/

const authenticate /* : Middleware */ = async (
  req /* : RequestWithUser<>  */,
  res,
  next,
) => {
  try {
    const { jwtToken } = req.query;
    // Verify token and store decoded content for future use
    req.user = await logger.time(
      promisify(jwt.verify)(jwtToken, config.jwt.secret),
    );
    next();
  } catch (error) {
    logger.error(error);
    res.status(401).send("You must be authenticated in order to hit /api");
  }
};

const UPSACLAY_CAS_REGEX = /^resa-upsaclay/;
const requireAuthOrigin /* : Middleware */ = async (
  req /* : RequestWithOrigin<>  */,
  res,
  next,
) => {
  if (UPSACLAY_CAS_REGEX.test(req.hostname)) {
    req.authOrigin = AuthOrigin.ParisSaclay;
    req.ownUrl = config.altOwnUrl;
  } else {
    req.authOrigin = AuthOrigin.CentraleSupelec;
    req.ownUrl = config.defaultOwnUrl;
  }
  next();
};

module.exports = { authenticate, requireAuthOrigin };
