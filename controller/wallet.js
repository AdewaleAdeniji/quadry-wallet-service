const { validateRequest, WrapHandler } = require("../middlewares/app");
const { generateID } = require("../utils");
const Flutterwave = require("flutterwave-node-v3");
const { getConfig } = require("./configHandler");
const {
  createFlutterwaveVirtualAccount,
} = require("../services/flutterwaveService");
const { WalletTypes } = require("../constants/wallet");
const {
  createWallet,
  getWallet,
  getWalletByWalletRef,
} = require("../services/wallets");
const {
  createDebitTransaction,
  createCreditTransaction,
} = require("./transactions");
const { getApiApp } = require("../services/apiApps");
const walletModel = require("../models/walletModel");
const transactionsModel = require("../models/transactionsModel");

// create wallet
// get wallet requires PIN
// move fund function
// create transaction session
// check balance requires PIN
// move wallet fund to master wallet
// dump wallet

const CreateWallet = WrapHandler(async (req, res) => {
  const body = req.body;
  const val = validateRequest(body, [
    "walletRef",
    "isPermanent",
    "isVirtualAccount",
  ]);
  if (val) return res.status(400).send(val);
  // walletID, appID, walletPIN
  body.walletID = generateID();
  body.appID = req.appID;
  body.walletType = body.isPermanent ? WalletTypes.PERM : WalletTypes.TEMP;
  // need to build integration for virtual accounts
  if (body.isVirtualAccount) {
    // create virtual account here
    const configs = await getConfig(req.appID);
    const flw = new Flutterwave(
      configs.flutterwaveKey.FLW_PUBLIC_KEY,
      configs.flutterwaveKey.FLW_SECRET_KEY
    );
    const payload = {
      email: body.email,
      amount: body?.amount,
      is_permanent: body.isPermanent,
    };
    console.log(payload);
    const createAccount = await createFlutterwaveVirtualAccount(flw, payload);
    if (!createAccount.success) return res.status(400).send(createAccount);
    body.walletAccount = {
      bank: createAccount.data.bank_name,
      number: createAccount.data.account_number,
      created: createAccount.data.created_at,
      expires: createAccount.data.expiry_date,
    };
    body.accountRef = payload.email;
  }
  //create wallet here
  const createwallet = await createWallet(body);
  if (!createwallet)
    return res.status(400).send({ message: "Failed to create wallet" });
  return res.status(200).send(createwallet);
});
const GetWallet = WrapHandler(async (req, res) => {
  // walletid, appid
  const appID = req.appID;
  const walletID = req.params.walletID;

  const wallet = await getWallet(walletID, appID);

  if (!wallet)
    return res.status(400).send({
      message: "Wallet not found",
    });
  wallet.walletPIN = undefined;
  return res.status(200).send(wallet);
});
const FundWallet = WrapHandler(async (req, res) => {
  // walletid, appid
  const appID = req.appID;
  const walletID = req.params.walletID;
  const body = req?.body;
  const val = validateRequest(body, ["amount"]);
  if (val) return res.status(400).send(val);
  const wallet = await getWallet(walletID, appID);

  if (!wallet)
    return res.status(400).send({
      message: "Wallet not found",
    });

  // at this point, we want to generate account details and save it on the wallet
  // we will create funding model too and save it

  const configs = await getConfig(req.appID);
  const flw = new Flutterwave(
    configs.flutterwaveKey.FLW_PUBLIC_KEY,
    configs.flutterwaveKey.FLW_SECRET_KEY
  );
  const internalCharge = 1;
  const payload = {
    email: body.email,
    amount: parseInt(body?.amount) + internalCharge,
    is_permanent: false,
  };
  console.log(payload);
  const createAccount = await createFlutterwaveVirtualAccount(flw, payload);
  if (!createAccount.success) return res.status(400).send({ message: "Failed to initiate payment gateway" });
  console.log(createAccount);
  const walletAccount = {
    bank: createAccount.data.bank_name,
    number: createAccount.data.account_number,
    created: createAccount.data.created_at,
    expires: createAccount.data.expiry_date,
  };
  const updates = {
    accountRef: payload.email,
    walletMetaData: {
      fundingPending: true,
      expectedAmount: createAccount.data.amount,
      fee:
        parseInt(createAccount.data.amount) -
        parseInt(payload.amount) +
        internalCharge,
      internalCharge,
    },
  };
  const updateWallet = await walletModel.findByIdAndUpdate(wallet._id, {
    walletAccount,
    ...updates,
  });
  if (!updateWallet)
    return res.status(400).send({ message: "Request Failed!" });
  const response = {
    ...walletAccount,
    expectedAmount: createAccount.data.amount,
    fee:
      parseInt(createAccount.data.amount) -
      parseInt(payload.amount) +
      internalCharge,
    internalCharge,
    walletID,
  };
  return res.status(200).send(response);
});
const GetWalletByRef = WrapHandler(async (req, res) => {
  // walletid, appid
  const appID = req.appID;
  const walletRef = req.params.walletRef;

  const wallet = await getWalletByWalletRef(walletRef, appID);

  if (!wallet)
    return res.status(400).send({
      message: "Wallet not found",
    });
  wallet.walletPIN = undefined;
  return res.status(200).send(wallet);
});
const MoveFunds = async (
  appID,
  amount,
  destinationWalletID,
  debitWalletID,
  description,
  debitMetadata,
  creditMetadata
) => {
  // this is a function for moving fund
  // get both wallets
  // check if balance is enough
  if (amount === 0)
    return {
      success: false,
      message: "Amount must be more than zero",
    };
  const debitWallet = await getWallet(debitWalletID, appID);
  //   console.log(debitWalletID, debitWallet);
  if (!debitWallet)
    return { success: false, message: "Debit Wallet not found " };
  // check if balance is sufficient
  if (amount > debitWallet.walletBalance) {
    return {
      success: false,
      message: "Insufficient balance on debit",
    };
  }
  //console.log(destinationWalletID)
  const destinationWallet = await getWallet(destinationWalletID, appID);
  // move the money here
  if (!destinationWallet)
    return { success: false, message: "Destination Wallet not found " };
  //console.log(destinationWallet)
  const debit = createDebitTransaction(
    appID,
    debitWallet,
    amount,
    description,
    debitMetadata
  );
  if (!debit)
    return {
      success: false,
      message: "Failed to initiate debit transaction",
    };
  const credit = createCreditTransaction(
    appID,
    destinationWallet,
    amount,
    description,
    creditMetadata
  );
  if (!credit) {
    const reversalCredit = createCreditTransaction(
      appID,
      debitWallet,
      amount,
      description + " P2P REVERSAL",
      {}
    );
    return {
      success: false,
      message: "Failed to initiate credit transaction - Transaction reversed",
    };
  }
  return {
    success: true,
  };
};

// receiving transfers
// moving funds from master to children and funding master wallets
const DumpWalletFundToMaster = WrapHandler(async (req, res) => {
  const appID = req.appID;
  const walletID = req.params.walletID;
  // get the wallet and dump all fund to master
  const debitWallet = await getWallet(walletID, appID);
  if (!debitWallet)
    return res.status(400).send({ message: "Wallet not found " });
  //   console.log(debitWallet);
  if (debitWallet.walletBalance == 0)
    return res.status(400).send({
      message: "Wallet already dumped",
    });
  if (!debitWallet.isCustomerWallet)
    return res.status(400).send({
      message: "Cannot dump wallet type",
    });
  const app = await getApiApp(appID);
  // get wallet ID and move fund
  const move = await MoveFunds(
    appID,
    debitWallet.walletBalance,
    app.appMasterWalletID,
    walletID,
    "DEBIT - DUMP",
    {},
    {}
  );
  await walletModel.findByIdAndUpdate(debitWallet._id, {
    walletStatus: false,
    walletMessage: "Dumped",
  });
  if (!move.success) return res.status(400).send(move);
  return res.send(move);
});
const GetWalletTransactions = WrapHandler(async (req, res) => {
  const walletID = req.params.walletID;
  const appID = req.appID;
  // check if wallet truly exist
  const wallet = await getWallet(walletID, appID);
  if (!wallet)
    return res.status(400).send({
      transactions: [],
      message: "No wallet found",
    });
  const transactions = await transactionsModel.find({
    walletID,
    appID,
  });
  return res.send({
    transactions,
    total: transactions.length,
    message: "Transactions retrieved successfully",
  });
});
const GetAppTransactions = WrapHandler(async (req, res) => {
  const appID = req.appID;
  const transactions = await transactionsModel.find({
    appID,
  });
  return res.send({
    transactions,
    total: transactions.length,
    message: "Transactions retrieved successfully",
  });
});
const GetAppWallets = WrapHandler(async (req, res) => {
  const appID = req.appID;
  const wallets = await walletModel.find({
    appID,
  });
  return res.send({
    wallets,
    total: wallets.length,
    message: "Wallets retrieved successfully",
  });
});
const templated = WrapHandler(async (req, res) => {
  const body = req.body;
  const val = validateRequest(body, ["numbers"]);
  if (val) return res.status(400).send(val);
  return res.sendStatus(200);
});
module.exports = {
  CreateWallet,
  GetWallet,
  MoveFunds,
  DumpWalletFundToMaster,
  GetWalletByRef,
  GetWalletTransactions,
  GetAppTransactions,
  GetAppWallets,
  FundWallet,
};
