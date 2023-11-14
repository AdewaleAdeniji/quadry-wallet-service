const transactionsModel = require("../models/transactionsModel");
const { updateWallet } = require("../services/wallets");
const { generateID } = require("../utils");

const createDebitTransaction = async (
  appID,
  wallet,
  amount,
  transactionDescription,
  meta
) => {
  const transaction = {
    appID,
    walletID: wallet?.walletID,
    amount,
    transactionDescription,
    transactionDirection: "DEBIT",
    oldBalance: wallet?.walletBalance,
    newBalance: parseFloat(wallet?.walletBalance) - parseFloat(amount),
    transactionMetaData: meta,
    transactionID: generateID(),
  };
  // update wallet balance
  const walletUpdate = {
    walletBalance: parseFloat(wallet.walletBalance) - parseFloat(amount),
    lastTransacted: Date.now(),
    _id: wallet._id,
  };
  const updateBalance = await updateWallet(walletUpdate);
  if (!updateBalance) return false;
  await transactionsModel.create(transaction);
  return true;
};
const createCreditTransaction = async (
  appID,
  wallet,
  amount,
  transactionDescription,
  meta
) => {
  const transaction = {
    appID,
    walletID: wallet?.walletID,
    amount,
    transactionDescription,
    transactionDirection: "CREDIT",
    oldBalance: wallet?.walletBalance,
    newBalance: parseFloat(wallet?.walletBalance) + parseFloat(amount),
    transactionMetaData: meta,
    transactionID: generateID(),
  };
  // update wallet balance
  const walletUpdate = {
    walletBalance: parseFloat(wallet.walletBalance) + parseFloat(amount),
    lastTransacted: Date.now(),
    _id: wallet._id,
  };
  const updateBalance = await updateWallet(walletUpdate);
  if (!updateBalance) return false;
  await transactionsModel.create(transaction);
  return true;
};

module.exports = {
  createCreditTransaction,
  createDebitTransaction,
};
