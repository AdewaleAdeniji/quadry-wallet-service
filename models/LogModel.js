const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logsSchema = new Schema(
  {
    description: {
      type: String,
      default: "",
    },
    app: {
      type: String,
      default: "",
    },
    dump: {
        type: Object,
        default: {}
    },
    action: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("logs", logsSchema);
