// @flow

const logger = require("./logger");

function retryUntil /* :: <T, K> */(
  fn /* : () => T | Promise<K> */,
  maxIterate /* : number */ = 2,
  timeout /* : number */ = 1000,
  filename /* : string | null */ = null,
) /* : Promise<T | K> */ {
  return new Promise(async (resolve, reject) => {
    try {
      // $FlowFixMe
      resolve(await Promise.resolve(fn()));
    } catch (error) {
      if (filename === null) {
        // eslint-disable-next-line
        filename = logger.filename(error);
      }
      logger.warn(`Retry ${maxIterate} in ${filename}`);
      if (maxIterate > 1) {
        logger.error(error);
        setTimeout(() => {
          // $FlowFixMe
          resolve(retryUntil(fn, maxIterate - 1, timeout, filename));
        }, timeout);
      } else {
        logger.error(fn.toString());
        reject(error);
      }
    }
  });
}

module.exports = retryUntil;
