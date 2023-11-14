// buy airtime here
const Flutterwave = require("flutterwave-node-v3");
const { validateRequest, WrapHandler } = require("../middlewares/app");
const { getWallet } = require("../services/wallets");
const { getApiApp } = require("../services/apiApps");
const { MoveFunds } = require("./wallet");
const { getConfig } = require("./configHandler");
const { buyAirtime } = require("../services/flutterwaveService");

const BuyAirtime = WrapHandler(async (req, res) => {
  const body = req.body;
  const { debitWalletID } = req.params;
  console.log(req.body)
  const val = validateRequest(body, ["number", "amount"]);
  if (val) return res.status(400).send(val);
  const { amount, number } = body;
  const appID = req.appID;
  const debitWallet = await getWallet(debitWalletID, appID);
  if (!debitWallet)
    return res.status(400).send({ message: "Wallet not found " });
  //   console.log(debitWallet);
  if (debitWallet.walletBalance == 0)
    return res.status(400).send({
      message: "Insufficient Balance to continue this transaction",
    });
  if (!debitWallet.isCustomerWallet)
    return res.status(400).send({
      message: "Cannot perform transaction on this wallet",
    });
  const app = await getApiApp(appID);
  // get wallet ID and move fund
  const move = await MoveFunds(
    appID,
    amount,
    app.appMasterWalletID,
    debitWalletID,
    `Airtime transaction for ${number}`,
    {},
    {}
  );
  if (!move.success)
    return res.status(400).send({
      message: "Airtime topup failed.",
      success: false,
    });

  const configs = await getConfig(req.appID);
  const flw = new Flutterwave(
    configs.flutterwaveKey.FLW_PUBLIC_KEY,
    configs.flutterwaveKey.FLW_SECRET_KEY
  );
  console.log(number, amount)
  const buy = await buyAirtime(flw, number, amount);
  console.log(buy);
  if (!buy.success) {
    // reverse money
    const move = await MoveFunds(
      appID,
      amount,
      debitWalletID,
      app.appMasterWalletID,
      "Airtime transaction reversal",
      {},
      {}
    );
    return res.status(400).send({
      message: "Airtime topup failed",
      success: false,
      //...buy,
    });
  }
  return res.status(200).send({
    message: "Airtime topup successful",
    success: true,
    //...buy,
  });
});

const templated = WrapHandler(async (req, res) => {
  const body = req.body;
  const val = validateRequest(body, ["number", "amount"]);
  if (val) return res.status(400).send(val);
  return res.sendStatus(200);
});
module.exports = {
  BuyAirtime,
};
