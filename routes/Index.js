const express = require("express");
const router = express.Router();

// ----------------------------- Product ----------------------------- //
const ProductRoute = require("./product/ProductRoute");
// ----------------------------- Product ----------------------------- //

module.exports = function(app) {
 app.use("/api", router)
 ProductRoute(router);
}