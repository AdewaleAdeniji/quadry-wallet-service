const WalletModel = require("../models/walletModel");

// create wallet
// get wallet
// update wallet

exports.createWallet = async (wallet) => {
  return await WalletModel.create(wallet);
};
exports.getWallet = async (walletID, appID) => {
  return await WalletModel.findOne({
    walletID,
  });
};
exports.getWalletByWalletRef = async (walletRef, appID) => {
  return await WalletModel.findOne({
    walletRef,
    appID,
  });
};
exports.getWalletByAccountRef = async (accountRef) => {
  return await WalletModel.findOne({
    accountRef,
  });
};
exports.updateWallet = async (wallet) => {
  return await WalletModel.findByIdAndUpdate(wallet._id, wallet);
};
