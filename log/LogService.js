const log = require("../../models/log/LogSchema"); // import the log model

// Log Get
exports.getlog = async (req, res) => {
  try {
    const { offset = 0, search = "", pagination = true } = req.body;
    const searchObject = { category: "Activity" };
    if (search) {
      searchObject.title = {
        $regex: search.toString().trim(),
        $options: "i",
      };
    }
    if (pagination === true) {
      const logstore = await log
        .find(searchObject)
        .skip(parseInt(offset, 10))
        .limit(6);
      const totalCount = await log.countDocuments(searchObject);
      res.json({ logstore, totalCount });
    } else {
      const logstore = await log.find(searchObject);
      const totalCount = await log.countDocuments(searchObject);
      res.json({ logstore, totalCount });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};
