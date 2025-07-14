const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    sectionid: {
      type: String,
      required: true,
    },
    sectionname: {
      type: String,
      required: true,
    },
    cmsdata: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Model Product
const product = new mongoose.model("product", productSchema);
module.exports = product;