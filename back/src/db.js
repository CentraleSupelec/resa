// @flow

const mongoose = require("mongoose");
const config = require("./config");

// remove deprecation warnings for mongoose 5.7
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

// auto create for settings
// mongoose.set("autoCreate", true);

const connect = async () => {
  await mongoose.connect(
    `mongodb://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.name}`,
    { useCreateIndex: true },
  );
  console.log("Connection with mongo done");
};

module.exports = connect;
