// @ts-nocheck
"use strict";
const dkb = require("./src/exporter.js");

(async function app() {
  await dkb.login();
  await dkb.download();
  await dkb.logout();
})();
