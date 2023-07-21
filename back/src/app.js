// lib
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
// src
const {
  authenticate,
  requireAuthOrigin,
} = require("./middlewares/authenticate");
const connectDB = require("./db");
const geodeDSClient = require("./geodeDS/client");
const { requireSuperAdmin } = require("./middlewares/authorize");

const admin = require("./routes/admin");
const book = require("./routes/book");
const confirm = require("./routes/confirm");
const dysfunction = require("./routes/dysfunction");
const login = require("./routes/login");
const member = require("./routes/member");
const greylist = require("./routes/greylist");
const search = require("./routes/search");
const user = require("./routes/user");
const room = require("./routes/room");
const whitelist = require("./routes/whitelist");
require("./utils/logger");

const app = express();

/*
CORS is only required in dev as the back-end is running at
resa-dev.centralesupelec.fr:3001, which is different from the front-end, running at
resa-dev.centralesupelec.fr:443.

In production, the host is resa.centralesupelec.fr for both the front-end and the
back-end, so the user's browser won't send Origin headers, and CORS will fail
server-side, as the cors module will have 'origin' set as 'undefined'.

TL;DR: necessary in dev, useless and problematic in production
*/

const setup = async () => {
  if (process.env.NODE_ENV === "development") {
    const corsWhitelist = [
      "http://localhost.centralesupelec.fr",
      "http://resa-upsaclay-dev.centralesupelec.fr",
    ];
    app.use(
      cors({
        origin(origin, callback) {
          if (corsWhitelist.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error("Not allowed by CORS"));
          }
        },
      }),
    );
  }

  await connectDB();
  await geodeDSClient.start();

  app.use(logger("dev"));
  app.use(helmet()); // securing headers
  app.use(express.json()); // parses JSON request body
  app.use(express.urlencoded({ extended: true })); // parses form body
  app.use(multer().any()); // parses form multipart/form-data and accepts any file

  app.use("/api/member", authenticate, member);
  app.use("/api/book", [requireAuthOrigin, authenticate], book);
  app.use("/api/search", [requireAuthOrigin, authenticate], search);
  app.use("/api/room", room); // ! /details/:roomId/:selectedDate/ isn't secure (to allow https://resa.centralesupelec.fr/recherche/438 without connection)
  app.use("/api/user", [requireAuthOrigin, authenticate], user);
  app.use("/api/login", requireAuthOrigin, login); // ! Nothing is secure because needs to connect
  app.use("/api/confirm", requireAuthOrigin, confirm); // ! Nothing is secure because only links from emails
  app.use("/api/greylist", authenticate, greylist);
  app.use("/api/whitelist", [authenticate, requireSuperAdmin], whitelist);

  // admin features
  app.use("/api/admin", authenticate, admin);
  app.use("/api/dysfunction", dysfunction); // ! GET / isn't secure

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error("Route Not Found");
    err.status = 404;
    next(err);
  });

  // error handler
  app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    console.log("[uncaught error]", err);
    // render the error page
    res.status(err.status || 500);
    res.render("error");
  });
};

setup();

module.exports = app;
