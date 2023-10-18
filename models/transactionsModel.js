const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionsSchema = new Schema(
  {
    appID: {
      type: String,
      immutable: true,
    },
    walletID: {
      type: String,
      immutable: true,
    },
    amount: Number,
    transactionStatus: String,
    transactionID: {
      type: String,
      immutable: true,
    },
    transactionDescription: String,
    transactionDirection: String,
    transactionMetaData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("wallet-transactions", transactionsSchema);
