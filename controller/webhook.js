const { validateRequest, WrapHandler } = require("../middlewares/app");
const hookLogs = require("../models/hookLogs");
const { verifyTransactionID } = require("../services/flutterwaveService");
const { getWalletByAccountRef, getWallet, getWalletWebhook } = require("../services/wallets");
const { generateID } = require("../utils");
const Flutterwave = require("flutterwave-node-v3");
const { getConfig } = require("./configHandler");
const { MoveFunds } = require("./wallet");
const { getPaymentByAccountRef } = require("../services/PaymentService");
const paymentModel = require("../models/paymentModel");

const saveHook = async (hooks) => {
  const hookObj = {
    hookID: generateID(),
    hookDump: hooks,
  };
  return await hookLogs.create(hookObj);
};
const FlutterwaveWebhook = WrapHandler(async (req, res) => {
  const body = req.body;
  //save hook
  await saveHook(body);
  // retrive wallet
  //verify transaction id
  const eventType = body["event.type"];
  if (eventType !== "BANK_TRANSFER_TRANSACTION") {
    // not a bank transfer do another thing
    console.log("unknown hook received");
  }
  const wallet = await getWalletByAccountRef(body.data.customer.email);
  if (!wallet) return res.status(200).send({ message: "Wallet not found " });
  const appID = wallet.appID;
  const configs = await getConfig(appID);
  if (!configs)
    return res.status(200).send({ message: "App or config not found" });
  const flw = new Flutterwave(
    configs.flutterwaveKey.FLW_PUBLIC_KEY,
    configs.flutterwaveKey.FLW_SECRET_KEY
  );
  const verify = await verifyTransactionID(flw, body.data.id);
  if (!verify.success)
    return res.status(200).send({ message: "Failed to verify transaction " });
  // #TODO verify duplicate transaction here
  // Wallet balance webhook
  // debit master wallet, credit the wallet in question with the settled amount
  //console.log(configs)
  const move = await MoveFunds(
    appID,
    verify.data.amount_settled,
    wallet.walletID,
    configs.masterWallet,
    "Wallet Funding",
    {},
    verify
  );
  return res.send(move);
});
const NewFlutterwaveWebhook = WrapHandler(async (req, res) => {
  const body = req.body;
  //save hook
  await saveHook(body);
  // retrive wallet
  //verify transaction id
  const eventType = body["event.type"];
  if (eventType !== "BANK_TRANSFER_TRANSACTION") {
    // not a bank transfer do another thing
    console.log("unknown hook received");
  }
  const payment = await getPaymentByAccountRef(body.data.customer.email);
  if (!payment) return res.status(200).send({ message: "Payment not found " });
  const walletID = payment?.walletID;
  console.log(payment)
  const wallet = await getWalletWebhook(walletID);
  // console.log(wallet)
  const appID = wallet?.appID;
  const configs = await getConfig(appID);
  if (!configs)
    return res.status(200).send({ message: "App or config not found" });
  const flw = new Flutterwave(
    configs.flutterwaveKey.FLW_PUBLIC_KEY,
    configs.flutterwaveKey.FLW_SECRET_KEY
  );
  const verify = await verifyTransactionID(flw, body.data.id);
  if (!verify.success)
    return res.status(200).send({ message: "Failed to verify transaction " });

  const transactionExist = await paymentModel.findOne({
    transactionID: verify.data.id,
  });
  // if(transactionExist) return res.status(400).send({message: "Transaction already honored"})
  const paymentStatus = verify.data.status === "successful" ? true : false;
  const paymentStatusText = verify.data.status;

  const paymentUpdate = {
    amountReceived: verify.data.amount_settled - payment.internalCharge,
    transactionID: verify.data.id,
    paymentStatus,
    paymentStatusText,
    funded: true,
    metaData: {
      transaction: verify.data,
      hook: body
    },
  }
  // update payment 
  const updatePayment  = await paymentModel.updateOne({paymentID: payment.paymentID}, paymentUpdate)
  if(!updatePayment) return res.status(400).send({message: "Failed to HONOR payment"});
  // Wallet balance webhook
  if(!paymentStatus) return res.status(400).send({message: "Payment not successful"});
  const move = await MoveFunds(
    appID,
    verify.data.amount_settled - payment.internalCharge,
    wallet.walletID,
    configs.masterWallet,
    "Wallet Funding",
    {},
    verify
  );
  return res.send(move);
});
const templated = WrapHandler(async (req, res) => {
  const body = req.body;
  const val = validateRequest(body, ["numbers"]);
  if (val) return res.status(400).send(val);
  return res.sendStatus(200);
});
module.exports = {
  FlutterwaveWebhook,
  NewFlutterwaveWebhook,
};
