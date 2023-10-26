const { createHash } = require("../utils");

exports.WalletTypes = {
  TEMP: "TEMPORARY",
  PERM: "PERMANENT",
};

exports.WalletErrors = {};

exports.WalletStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
  SUSPENDED: "SUSPENDED",
  PND: "PND",
};

exports.PaymentStatusTexts = {
  PENDING: "pending",
  SUCCESSFUL: "successful",
  FAILED: "failed",
  REVERSED: "reversed",
};