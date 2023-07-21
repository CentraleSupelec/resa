// @flow
// src
const connect = require("../webservice/connect");
const retryUntil = require("../utils/retryUntil");

/* ::
  import type { Middleware, $Request} from 'express'
  import type { Request} from './authenticate'
*/

const requireAgendaAnnuaire /* : Middleware */ = async (
  req /* : Request<>  */,
  res,
  next,
) => {
  const [session, agendaClient, annuaireClient] = await Promise.all([
    retryUntil(connect.newSession),
    retryUntil(connect.getAgendaClient),
    retryUntil(connect.getAnnuaireClient),
  ]);

  req.geode = {
    guid: session.guid,
    agendaClient,
    annuaireClient,
  };

  res.on("finish", () => {
    connect.endSession(session);
  });
  next();
};

const requireAgenda /* : Middleware */ = async (
  req /* : Request<>  */,
  res,
  next,
) => {
  const [session, agendaClient] = await Promise.all([
    retryUntil(connect.newSession),
    retryUntil(connect.getAgendaClient),
  ]);

  req.geode = {
    guid: session.guid,
    agendaClient,
    annuaireClient: null,
  };

  res.on("finish", () => {
    connect.endSession(session);
  });
  next();
};

const requireAnnuaire /* : Middleware */ = async (
  req /* : Request<>  */,
  res,
  next,
) => {
  const [session, annuaireClient] = await Promise.all([
    retryUntil(connect.newSession),
    retryUntil(connect.getAnnuaireClient),
  ]);

  req.geode = {
    guid: session.guid,
    annuaireClient,
    agendaClient: null,
  };

  res.on("finish", () => {
    connect.endSession(session);
  });
  next();
};

module.exports = { requireAgendaAnnuaire, requireAgenda, requireAnnuaire };
