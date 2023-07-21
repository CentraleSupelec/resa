// lib
const Handlebars = require("handlebars");
const juice = require("juice");
const fs = require("fs");

/* eslint-disable */
require.extensions[".html"] = function(module, filename) {
  module.exports = fs.readFileSync(filename, "utf8");
};
/* eslint-enable */
const templateSource = require("./source.html");

module.exports = Handlebars.compile(juice(templateSource), { noEscape: true });
