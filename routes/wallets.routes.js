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
const { BuyAirtime } = require("../controller/spend");
const { GetPayment } = require("../controller/payment");

const walletRouter = express.Router();

walletRouter.route("/create").post(CreateWallet);
walletRouter.route("/:walletID").get(GetWallet);
walletRouter.route("/fund/:walletID").post(FundWallet);
walletRouter.route("/payment/:paymentID").get(GetPayment);
walletRouter.route("/dump/:walletID").get(DumpWalletFundToMaster);
walletRouter.route("/move/:amount/master/:debitWalletID").post(TransferWalletFundsToMaster);
walletRouter.route("/walletRef/:walletRef").get(GetWalletByRef);
walletRouter.route("/apps/list").get(GetAppWallets);

walletRouter.route("/transactions/app").get(GetAppTransactions);
walletRouter.route("/transactions/:walletID").get(GetWalletTransactions);

walletRouter.route("/spend/airtime/:debitWalletID").post(BuyAirtime);

module.exports = walletRouter;
