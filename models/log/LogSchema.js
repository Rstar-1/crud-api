const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['SUCCESS', 'FAILURE'],
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Model Log
const log = mongoose.model("log", logSchema);
module.exports = log;
