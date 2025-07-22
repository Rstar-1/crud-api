const Controller = require("../../controllers");

module.exports = function (app) {
  app.post("/createproduct", Controller.Productontroller.createproduct);
  app.post("/getproduct", Controller.Productontroller.getproduct);
  app.get(
    "/singleproduct/:id",
    Controller.Productontroller.singleproduct
  );
  app.patch(
    "/updateproduct/:id",
    Controller.Productontroller.updateproduct
  );
  app.patch(
    "/statusproduct/:id",
    Controller.Productontroller.statusproduct
  );
  app.delete(
    "/deleteproduct/:id",
    Controller.Productontroller.deleteproduct
  );
  app.delete(
    "/bulkdeleteproduct",
    Controller.Productontroller.bulkdeleteproduct
  );
};
