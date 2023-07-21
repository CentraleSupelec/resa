const kleur = require("kleur");

class CustomError extends Error {
  constructor(message, code = 500) {
    super(message);
    this.catched = false;
    this.code = code;
  }
}

const filename = err => {
  const isCustomError = err instanceof CustomError;
  const isError = err instanceof Error;
  const error = isError ? err : new Error();
  const errors = error.stack.split("\n");
  const errorLine = isCustomError ? 1 : errors.length - 2;
  return kleur.cyan(
    errors[isError ? errorLine : 2].replace(/.*\(/, "").replace(/\).*/, ""),
  );
};

module.exports = {
  filename,
  error: error => {
    console.error("=============================================");
    console.error(`In ${filename(error)} at ${new Date().toISOString()}`);
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    console.error("---------------------------------------------\n");
  },
  warn: console.warn,
  time: async promise => {
    const timeName = `In ${filename()} (rid: ${Math.random()})`;
    console.time(timeName);
    const res = await promise;
    console.timeEnd(timeName);
    return res;
  },
  Error: CustomError,
};
