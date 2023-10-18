const fundModel = require("../models/fundModel");

// create wallet
// get wallet
// update wallet

exports.createFundingModel = async (fundmodel) => {
  return await fundModel.create(fundmodel);
};
exports.getFundingModel = async (walletID) => {
  return await fundModel.findOne({
    walletID,
  });
};
exports.getFundingModelByID = async (fundingID) => {
  return await fundModel.findOne({
    fundingID,
  });
};
exports.updateFundingModel = async (fundmodel) => {
  return await fundModel.findByIdAndUpdate(fundmodel._id, fundmodel);
};
