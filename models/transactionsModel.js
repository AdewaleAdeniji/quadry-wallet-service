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
    oldBalance: {
      type: mongoose.Types.Decimal128,
      default: 0,
      get: (v) => v.toString(),
    },
    newBalance: {
      type: mongoose.Types.Decimal128,
      default: 0,
      get: (v) => v.toString(),
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
transactionsSchema.set("toObject", { getters: true });
transactionsSchema.set("toJSON", { getters: true });

module.exports = mongoose.model("wallet-transactions", transactionsSchema);
