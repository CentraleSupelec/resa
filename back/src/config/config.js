const secrets = require("./secrets.json");

module.exports = {
  // CS default settings
  defaultOwnUrl: secrets.defaultOwnUrl,
  defaultCas: {
    rscUrl: secrets.defaultCas.rscUrl,
    service: secrets.defaultCas.service,
  },
  // ParisSaclay settings
  altOwnUrl: secrets.parisSaclayOwnUrl,
  altCas: {
    rscUrl: secrets.parisSaclayCas.rscUrl,
    service: secrets.parisSaclayCas.service,
  },
  parisSaclayGeodeId: secrets.parisSaclayGeodeId,
  webservice: {
    sessionurl:secrets.webservice.sessionurl,
    agendaurl: secrets.webservice.agendaurl,
    annuaireurl: secrets.webservice.annuaireurl,
    user: secrets.webservice.user,
    password: secrets.webservicePassword,
  },
  geodeDSClient: secrets.geodeDSClient,
  geodeDSRoot: secrets.geodeDSRoot,
  jwt: {
    secret: secrets.jwtSecret,
  },
  cypher: {
    salt: secrets.cypherSalt,
    tokenSecret: secrets.tokenSalt,
  },
  smtp: {
    host: secrets.smtp.host,
    port: secrets.smtp.port,
  },
  adminEmail: secrets.adminEmail,
  ccEmail: secrets.ccEmail,
  server: {},
  public: {},
  db: secrets.db,
};
