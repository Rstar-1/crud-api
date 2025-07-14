const logService = require("../../services/log/LogService");

exports.getlog = async function (req, res) {
  try {
    var users = await logService.getlog(req, res);

    return res.status(200).json({
      status: 200,
      data: users,
      message: "Record data successfully",
    });
  } catch (error) {
    error;
  }
};