module.exports =
  process.env.NODE_ENV === "production"
    ? require("./translatorConfig-prod.json")
    : require("./translatorConfig-dev.json");
