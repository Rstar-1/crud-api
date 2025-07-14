const productService = require("../../services/product/ProductService");

exports.productadddata = async function (req, res) {
  try {
    var users = await productService.productadddata(req, res);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Record data successfully",
    });
  } catch (error) {
    error;
  }
};

exports.productgetdata = async function (req, res) {
  try {
    var users = await productService.productgetdata(req, res);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Record data successfully",
    });
  } catch (error) {
    error;
  }
};

exports.productpaginationdata = async function (req, res) {
  try {
    var users = await productService.productpaginationdata(req, res);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Record data successfully",
    });
  } catch (error) {
    error;
  }
};

exports.productsingledata = async function (req, res) {
  try {
    var users = await productService.productsingledata(req, res);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Record data successfully",
    });
  } catch (error) {
    error;
  }
};

exports.productupdatedata = async function (req, res) {
  try {
    var users = await productService.productupdatedata(req, res);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Record data successfully",
    });
  } catch (error) {
    error;
  }
};

exports.productdeletedata = async function (req, res) {
  try {
    var users = await productService.productdeletedata(req, res);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Record data successfully",
    });
  } catch (error) {
    error;
  }
};