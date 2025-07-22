const product = require("../../models/product/ProductSchema");
const log = require("../../models/log/LogSchema");

// Common Schema Feilds
const fields = Object.entries(product.schema.paths)
  .filter(([k, v]) => (["String", "Number"].includes(v.instance)) && !["_id", "__v"].includes(k))
  .map(([k]) => k);
  
// Product Create
exports.createproduct = async (req, res) => {
  try {
    const productData = {};
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        productData[field] = req.body[field];
      }
    });
    const adduser = new product(productData);
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
      searchObject.$and = terms.map(term => ({
        $or: fields.map(field => ({
          [field]: { $regex: term, $options: "i" }
        }))
      }));
    }
    searchFilters.forEach(({ field, value, from, to }) => {
      if (!field) return;
      const fieldType = product.schema.path(field)?.instance;

      if (fieldType === "Date" && (from || to)) {
        searchObject[field] = {};
        if (from) searchObject[field].$gte = new Date(from);
        if (to) searchObject[field].$lte = new Date(to);
      } else if (value?.trim()) {
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
  const { id } = req.params;
  try {
    const updateData = {};
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
    const updates = await product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updates) {
      await log.create({
        title: sectionname || "Unknown Section",
        status: "FAILURE",
        message: `Product not found: ${id}`,
      });
      return res.status(404).json({ error: "Product not found" });
    }
    await log.create({
      title: updates.sectionname,
      status: "SUCCESS",
      message: `Product updated: ${updates._id}`,
    });
    res.status(201).json(updates);
  } catch (error) {
    await log.create({
      title: sectionname || "Unknown Section",
      status: "FAILURE",
      message: `Update error for product ${id}: ${error.message}`,
    });
    res.status(422).json({ error: error.message });
  }
};

// Product status
exports.statusproduct = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updated = await product.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) {
      await log.create({ title: updated?.sectionname || "Unknown", status: "FAILURE", message: `Product not found: ${id}` });
      return res.status(404).json({ error: "Product not found" });
    }
    await log.create({ 
      title: updated.sectionname, 
      status: "SUCCESS", 
      message: `Product status updated: ${id} to ${status}` });
    res.status(201).json(updated);
  } catch (error) {
    await log.create({ 
      title: "Unknown", 
      status: "FAILURE", 
      message: `Status update error: ${error.message}` });
    res.status(422).json({ error: error.message });
  }
};

// Product Delete
exports.deleteproduct = async (req, res) => {
  try {
    const { id } = req.params;
    const trash = await product.findByIdAndDelete({ _id: id });
    if (!trash) {
      return res.status(404).json({ error: "Product not found" });
    }
    await log.create({
      title: trash.sectionname || "Unknown Section",
      status: "SUCCESS",
      message: `Product deleted: ${trash._id}`,
    });
    res.status(201).json(trash);
  } catch (error) {
    await log.create({
      title: "Unknown Section",
      status: "FAILED",
      message: `Error deleting product with ID ${req.params.id}: ${error.message}`,
    });

    res.status(422).json(error);
  }
};

// Product Bulk Delete
exports.bulkdeleteproduct = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No product deletion" });
    }
    const productsToDelete = await product.find({ _id: { $in: ids } });
    if (productsToDelete.length === 0) {
      return res.status(404).json({ error: "No products found" });
    }
    const deleteResult = await product.deleteMany({ _id: { $in: ids } });
    const logPromises = productsToDelete.map((prod) =>
      log.create({
        title: prod.sectionname || "Unknown Section",
        status: "SUCCESS",
        message: `Product deleted: ${prod._id}`,
      })
    );
    await Promise.all(logPromises);
    res.status(200).json({
      message: `${deleteResult.deletedCount} products deleted successfully`,
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    // Log the failure for bulk delete
    await log.create({
      title: "Bulk Delete Products",
      status: "FAILED",
      message: `Error deleting products with IDs ${req.body.ids}: ${error.message}`,
    });

    res.status(422).json({ error: error.message });
  }
};
