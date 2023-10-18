const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fundingSchema = new Schema(
  {
    amount: {
      type: String,
      default: "",
    },
    walletID: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: false,
    },
    fundingID: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("fundingLog", fundingSchema);
