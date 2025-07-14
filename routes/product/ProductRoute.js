const Controller = require("../../controllers");

module.exports = function (app) {
  app.post("/productadddata", Controller.Productontroller.productadddata);
  app.get("/productgetdata", Controller.Productontroller.productgetdata);
  app.post(
    "/productpaginationdata",
    Controller.Productontroller.productpaginationdata
  );
  app.get(
    "/productsingledata/:id",
    Controller.Productontroller.productsingledata
  );
  app.patch(
    "/productupdatedata/:id",
    Controller.Productontroller.productupdatedata
  );
  app.delete(
    "/productdeletedata/:id",
    Controller.Productontroller.productdeletedata
  );
};