// lib
const queryString = require("query-string");
const got = require("got");
// src
const config = require("../config/index");
// config
const { geodeDSRoot, geodeDSBasicAuth } = config;
const API_PREFIX = "/api/v1.0";
const TOKEN_OPTIONS = {
  grant_type: "client_credentials",
  scope: "meetings_write",
};

// Private state
let managedClient;
let expireAt;

// Private methods
const requestAccessToken = async () => {
  const response = await got.post(`${geodeDSRoot}/api/token`, {
    body: queryString.stringify(TOKEN_OPTIONS),
    headers: {
      authorization: `Basic ${geodeDSBasicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    responseType: "json",
  });
  const { body } = response;
  const { access_token, expires_in } = body;
  expireAt = new Date().getTime() + expires_in * 1000; // getTime in milliseconds VS expires_in in seconds
  return access_token;
};

const start = async () => {
  try {
    const accessToken = await requestAccessToken();
    console.log(`[Geode-DS] access token received`);
    managedClient = got.extend({
      prefixUrl: geodeDSRoot + API_PREFIX,
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      responseType: "json",
      hooks: {
        // useful when debugging requests
        beforeRequest: [
          (options) => {
            console.log("[Geode DS] call to: ", options.url.href);
          },
        ],
        afterResponse: [
          async (response, retryWithMergedOptions) => {
            if (response.statusCode === 401) {
              const newAccessToken = await requestAccessToken();
              const updatedOptions = {
                headers: {
                  authorization: `Bearer ${newAccessToken}`,
                },
              };
              // Save for further requests
              managedClient.defaults.options = got.mergeOptions(
                managedClient.defaults.options,
                updatedOptions,
              );
              // Make a new retry
              return retryWithMergedOptions(updatedOptions);
            }
            // No changes otherwise
            return response;
          },
        ],
      },
      retry: {
        limit: 5,
      },
      mutableDefaults: true,
    });
    console.log("[Geode-DS] client initialized");
  } catch (error) {
    console.error(error); // more on error.options
  }
};

const isReady = () => {
  const now = new Date().getTime();
  return Boolean(expireAt) && now < expireAt;
};

const get = async () => {
  // request new access token
  if (!isReady()) await start();
  return managedClient;
};

module.exports = {
  start,
  get,
};
