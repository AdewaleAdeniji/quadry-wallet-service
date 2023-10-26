const mongoose = require("mongoose");
const { PaymentStatusTexts } = require("../constants/wallet");
const Schema = mongoose.Schema;

const paymentsSchema = new Schema(
  {
    accountRef: {
      type: String,
      immutable: true,
    },
    paymentID: {
      type: String,
      immutable: true,
    },
    number: {
      type: String,
      immutable: true,
    },
    bank: {
      type: String,
      immutable: true,
    },
    walletID: {
      type: String,
      immutable: true,
    },
    metaData: {
      default: {},
      type: Object,
    },
    funded: {
      type: Boolean,
      default: false,
    },
    fee: {
      type: String,
      default: "0",
    },
    internalCharge: { 
      type: String,
      default: "0",
    },
    status: {
      type: Boolean,
      default: false,
    },
    paymentStatusText: {
      type: String,
      default: PaymentStatusTexts.PENDING,
    },
    paymentMode: {
      type: String,
      default: "BANK_TRANSFER",
    },
    amountExpected: {
      type: String,
      default: 0,
    },
    amountReceived: {
      type: String,
      default: 0,
    },
    
    transactionID: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("payments", paymentsSchema);
