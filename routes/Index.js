const express = require("express");
const router = express.Router();

// ----------------------------- API ----------------------------- //
const ProductRoute = require("./product/ProductRoute");
// ----------------------------- API ----------------------------- //
// ----------------------------- Logs ----------------------------- //
const LogRoute = require("./log/LogRoute");
// ----------------------------- Logs ----------------------------- //

module.exports = function(app) {
 app.use("/api", router)
 ProductRoute(router);
 LogRoute(router);
}
