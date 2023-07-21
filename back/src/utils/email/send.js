// lib
const nodemailer = require("nodemailer");
// src
const config = require("../../config");

module.exports = function send(
  destinationAddress,
  subject,
  plaintextBody,
  htmlBody,
  attachments,
  bcc,
) {
  // Set SMTP parameters
  const smtpConfig = config.smtp;
  const transporter = nodemailer.createTransport(smtpConfig);
  const SENDER = config.sender_email;

  // Setup e-mail data
  // doc: https://nodemailer.com/message/
  const mailOptions = {
    from: SENDER, // sender address
    to: destinationAddress, // list of receivers
    bcc,
    subject: `[Resa] ${subject}`, // Subject line
    text: plaintextBody, // plain text body
    html: htmlBody, // html body
    attachments,
  };

  // send e-mail with defined transport object
  return new Promise((resolve, reject) =>
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
        // logger.error(error);
        return;
      }
      console.log(`Email sent to ${destinationAddress}`);
      resolve(info);
    }),
  );
};
