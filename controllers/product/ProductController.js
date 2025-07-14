const productService = require("../../services/product/ProductService");

exports.createproduct = async function (req, res) {
  try {
    var users = await productService.createproduct(req, res);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Record data successfully",
    });
  } catch (error) {
    error;
  }
};

exports.getproduct = async function (req, res) {
  try {
    var users = await productService.getproduct(req, res);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Record data successfully",
    });
  } catch (error) {
    error;
  }
};

exports.singleproduct = async function (req, res) {
  try {
    var users = await productService.singleproduct(req, res);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Record data successfully",
    });
  } catch (error) {
    error;
  }
};

exports.updateproduct = async function (req, res) {
  try {
    var users = await productService.updateproduct(req, res);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Record data successfully",
    });
  } catch (error) {
    error;
  }
};

exports.statusproduct = async function (req, res) {
  try {
    var users = await productService.statusproduct(req, res);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Record data successfully",
    });
  } catch (error) {
    error;
  }
};

exports.deleteproduct = async function (req, res) {
  try {
    var users = await productService.deleteproduct(req, res);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Record data successfully",
    });
  } catch (error) {
    error;
  }
};
