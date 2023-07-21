const crypto = require("crypto");

const config = require("../config");

const encrypt = (input) => {
  const encrypter = crypto.createCipheriv("aes256", config.cypher.salt);
  const encrypted = encrypter.update(input, "utf8", "hex");
  return encrypted + encrypter.final("hex");
};

const decrypt = (input) => {
  const decrypter = crypto.createDecipheriv("aes256", config.cypher.salt);
  const decrypted = decrypter.update(input, "hex", "utf8");
  return decrypted + decrypter.final();
};

const generateToken = (booking) => {
  const stringToCypher = `${booking.roomId}_${booking.userMail}_${
    booking.eventName
  }_${booking.startDate.getTime()}_${booking.endDate.getTime()}_${
    booking.roomDeletageEmail
  }_${booking.sentEmailDate.getTime()}`;

  return crypto
    .createHmac("sha256", config.cypher.tokenSecret)
    .update(stringToCypher)
    .digest("hex");
};

module.exports = {
  encrypt,
  decrypt,
  generateToken,
};
