const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hookLogSchema = new Schema(
  {
    hookID: {
      type: String,
      immutable: true,
      unique: true,
    },
    hookDump: Object,
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("hookLogs", hookLogSchema);
