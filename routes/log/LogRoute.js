const Controller = require("../../controllers");

module.exports = function (app) {
  app.get("/getlog", Controller.Logcontroller.getlog);
};