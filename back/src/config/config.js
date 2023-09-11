const secrets = require("./secrets.json");

module.exports = {
  // CS default settings
  defaultOwnUrl: secrets.defaultOwnUrl,
  defaultCas: {
    rscUrl: secrets.defaultCas.rscUrl,
    service: secrets.defaultCas.service,
  },
  // Alt settings
  altOwnUrl: secrets.altOwnUrl,
  altCas: {
    rscUrl: secrets.altCas.rscUrl,
    service: secrets.altCas.service,
  },
  altGeodeId: secrets.altGeodeId,
  webservice: {
    sessionurl: secrets.webservice.sessionurl,
    agendaurl: secrets.webservice.agendaurl,
    annuaireurl: secrets.webservice.annuaireurl,
    user: secrets.webservice.user,
    password: secrets.webservice.password,
  },
  geodeDSClient: secrets.geodeDSClient,
  geodeDSRoot: secrets.geodeDSRoot,
  jwt: {
    secret: secrets.jwtSecret,
  },
  cypher: {
    salt: secrets.cypher.salt,
    tokenSecret: secrets.cypher.tokenSecret,
  },
  smtp: {
    host: secrets.smtp.host,
    port: secrets.smtp.port,
    auth: secrets.smtp.auth ? secrets.smtp.auth : undefined,
  },
  senderEmail: secrets.senderEmail,
  adminEmail: secrets.adminEmail,
  ccEmail: secrets.ccEmail,
  server: {},
  public: {},
  db: secrets.db,
};
