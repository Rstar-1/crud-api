const product = require("../../models/product/ProductSchema");
const log = require("../../models/log/LogSchema");

// Product Create
exports.createproduct = async (req, res) => {
  const { sectionid, sectionname, cmsdata } = req.body;
  try {
    const adduser = new product({
      sectionid,
      sectionname,
      cmsdata,
    });
    await adduser.save();
    await log.create({
      title: adduser.sectionname,
      status: "SUCCESS",
      message: `Product created: ${adduser._id}`,
    });
    res.status(201).json(adduser);
    //console.log(adduser, "productadddata");
  } catch (error) {
    await log.create({
      title: adduser.sectionname,
      status: "FAILURE",
      message: `Error: ${error.message}`,
    });
    res.status(422).json(error);
  }
};

// Product Get
exports.getproduct = async (req, res) => {
  try {
    const {
      offset = 0,
      search = "",
      searchsectionname = "",
      searchsectionid = "",
      searchcmsdata = "",
      pagination = true,
    } = req.body;
    const searchObject = { status: true };
    if (search.trim()) {
      const terms = search.toString().trim().split(/\s+/);

      // Get all paths (keys) from the schema excluding __v, _id, etc.
      const schemaPaths = Object.entries(product.schema.paths)
        .filter(
          ([key, value]) =>
            (value.instance === "String" || value.instance === "Number") &&
            !["_id", "__v"].includes(key)
        )
        .map(([key]) => key);

      searchObject.$and = terms.map((term) => ({
        $or: schemaPaths.map((field) => ({
          [field]: { $regex: term, $options: "i" },
        })),
      }));
    }
    const fieldSearchMap = {
      sectionname: searchsectionname,
      sectionid: searchsectionid,
      cmsdata: searchcmsdata,
    };
    Object.entries(fieldSearchMap).forEach(([key, val]) => {
      if (val?.trim()) {
        searchObject[key] = {
          $regex: val.toString().trim(),
          $options: "i",
        };
      }
    });
    if (pagination === true) {
      const productstore = await product
        .find(searchObject)
        .skip(parseInt(offset, 10))
        .limit(6);
      const totalCount = await product.countDocuments(searchObject);
      res.json({ productstore, totalCount });
    } else {
      const productstore = await product.find(searchObject);
      const totalCount = await product.countDocuments(searchObject);
      res.json({ productstore, totalCount });
    }
    res.json({ productstore, totalCount });
  } catch (err) {
    res.status(500).json({ error: err.message || "Server error" });
  }
};

// Product Single
exports.singleproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const individual = await product.findById({ _id: id });
    res.status(201).json(individual);
    //console.log(userindividual, "productsingledata");
  } catch (error) {
    res.status(422).json(error);
  }
};

// Product Update
exports.updateproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = await product.findByIdAndUpdate(
      id,
      {
        sectionid: req.body.sectionid,
        sectionname: req.body.sectionname,
        cmsdata: req.body.cmsdata,
      },
      {
        new: true,
      }
    );
    //console.log(updates, "productupdatedata");
    res.status(201).json(updates);
  } catch (error) {
    res.status(422).json(error);
  }
};

// Product status
exports.statusproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const active = await product.findByIdAndUpdate(
      id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );
    //console.log(active, "statusproduct");
    res.status(201).json(active);
  } catch (error) {
    res.status(422).json(error);
  }
};

// Product Delete
exports.deleteproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const trash = await product.findByIdAndDelete({ _id: id });
    res.status(201).json(trash);
    //console.log(trash, "productdeletedata");
  } catch (error) {
    res.status(422).json(error);
  }
};
