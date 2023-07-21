// @flow

const error = Symbol("error");

async function awaitAndFilter /* :: <T> */(
  list /* : Array<Promise<T>> */,
) /* : Promise<Array<T>> */ {
  // $FlowFixMe
  const results /* : Array<T> */ = await Promise.all(
    list.map(promise => promise.catch(() => error)),
  );
  return results.filter(result => result !== error);
}

module.exports = { awaitAndFilter };
