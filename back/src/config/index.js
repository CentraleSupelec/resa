const config = require("./config");

module.exports = {
  ...config,
  geodeDSBasicAuth: Buffer.from(
    `${config.geodeDSClient.id}:${config.geodeDSClient.secret}`,
  ).toString("base64"),
};
