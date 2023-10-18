const mongoose = require("mongoose");
const { WalletTypes, WalletStatus } = require("../constants/wallet");
const Schema = mongoose.Schema;

const walletSchema = new Schema(
  {
    appID: {
      type: String,
      immutable: true,
    },
    walletID: {
      type: String,
      immutable: true,
    },
    walletRef: {
      type: String,
      immutable: true,
      unique: true,
    },
    accountRef: {
      type: String,
      immutable: true,
      default: "",
    },
    walletAccount: {
      type: Object,
      default: {
        bank: "",
        number: "",
        created: "",
        expires: "",
      },
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    walletPIN: {
      type: String,
      default: "",
    },
    walletPINSet: {
      type: Boolean,
      default: false,
    },
    walletStatus: {
      type: Boolean,
      default: true,
    },
    walletStatusText: {
      type: String,
      default: WalletStatus.ACTIVE,
    },
    isCustomerWallet: {
      type: Boolean,
      default: true,
    },
    walletMessage: {
      type: String,
      default: "",
    },
    walletType: {
      type: String,
      default: WalletTypes.TEMP,
    },
    lastTransacted: {
      type: String,
      default: "",
    },
    walletMetaData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("wallets", walletSchema);
