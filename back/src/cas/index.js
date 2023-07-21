// lib
const got = require("got");
const queryString = require("query-string");
const xml2js = require("xml2js");
// src

// API
const validateTicket = async (cas, ticket) => {
  const query = queryString.stringify({
    service: cas.service,
    ticket,
  });
  const res = await got(`${cas.rscUrl}?${query}`);
  const body = await xml2js.parseStringPromise(res.body.replace(/cas:/g, ""));
  return body;
};

// Export API
module.exports = { validateTicket };
