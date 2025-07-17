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
      searchFilters = [],
      statusFilter = "true",
      pagination = true,
      sortKey = "",
      sortDirection = "",
    } = req.body;
    const searchObject = {};
    if (statusFilter === "true") searchObject.status = true;
    else if (statusFilter === "false") searchObject.status = false;

    if (search.trim()) {
      const terms = search.trim().split(/\s+/);
      const fields = Object.entries(product.schema.paths)
        .filter(([k, v]) => (["String", "Number"].includes(v.instance)) && !["_id", "__v"].includes(k))
        .map(([k]) => k);

      searchObject.$and = terms.map(term => ({
        $or: fields.map(field => ({ [field]: { $regex: term, $options: "i" } })),
      }));
    }

    searchFilters.forEach(({ field, value }) => {
      if (field && value?.trim()) {
        searchObject[field] = { $regex: value.trim(), $options: "i" };
      }
    });
    const query = product.find(searchObject);
    if (sortKey) {
      const sortOrder = sortDirection === "desc" ? -1 : 1;
      const fieldType = product.schema.path(sortKey)?.instance;

      if (fieldType === "String") {
        query.collation({ locale: 'en', strength: 2 }); // case-insensitive sort
      }

      query.sort({ [sortKey]: sortOrder });
    }
    if (pagination === true || pagination === "true") {
      query.skip(Number(offset)).limit(6);
    }

    const [productstore, totalCount] = await Promise.all([
      query.exec(),
      product.countDocuments(searchObject),
    ]);

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
