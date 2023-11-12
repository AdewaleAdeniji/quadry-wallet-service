const express = require("express");
const {
  CreateWallet,
  GetWallet,
  DumpWalletFundToMaster,
  GetWalletByRef,
  GetWalletTransactions,
  GetAppTransactions,
  GetAppWallets,
  FundWallet,
  TransferWalletFundsToMaster
} = require("../controller/wallet");

const walletRouter = express.Router();

walletRouter.route("/create").post(CreateWallet);
walletRouter.route("/:walletID").get(GetWallet);
walletRouter.route("/fund/:walletID").post(FundWallet);
walletRouter.route("/dump/:walletID").get(DumpWalletFundToMaster);
walletRouter.route("/move/:amount/master/:debitWalletID").post(TransferWalletFundsToMaster);
walletRouter.route("/walletRef/:walletRef").get(GetWalletByRef);
walletRouter.route("/apps/list").get(GetAppWallets);

walletRouter.route("/transactions/app").get(GetAppTransactions);
walletRouter.route("/transactions/:walletID").get(GetWalletTransactions);

module.exports = walletRouter;
