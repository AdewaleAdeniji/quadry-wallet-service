//create app
const { WalletTypes } = require("../constants/wallet");
const { WrapHandler, validateRequest } = require("../middlewares/app");
const { createApiApp, getApiApp } = require("../services/apiApps");
const { createWallet } = require("../services/wallets");
const { generateID, generateKey, signToken } = require("../utils/index");

// get a created app by id
const CreateApiApp = WrapHandler(async (req, res) => {
  const body = req.body;
  const val = validateRequest(body, ["appName"]);
  if (val) return res.status(400).send(val);
  const appID = generateID();
  body.appID = appID;
  body.appKeys = {
    public: generateKey(true),
    private: generateKey(false),
  };
  body.appToken = signToken({
    appID,
    appName: body.appName,
  });
  const payload = {
    appID: appID,
    walletRef: appID,
    isCustomerWallet: false,
    walletID: generateID(),
    walletType: WalletTypes.PERM,
  }
  body.appMasterWalletID = payload.walletID;
  const createApp = await createApiApp(body);
  if (!createApp) {
    return res.status(400).send({ message: "Failed to create app " });
  }
  // create master wallet for the app
  const createwallet = await createWallet(payload)
  return res.status(200).send(createApp);
});
const GetApiApp = WrapHandler(async (req, res) => {
  const appID = req.appID;
  const app = await getApiApp(appID);
  if (!app) return res.status(404).send({ message: "App not found" });
  app.appConfigs = {
    useDefaultFlutterwaveKey:  app.appConfigs.useDefaultFlutterwaveKey
  }
  return res.status(200).send(app);
});
const templated = WrapHandler(async (req, res) => {
  //   const hasSetup = await hasUserSetup(req.userID);
  if (!hasSetup) return res.status(403).send({ message: "Unauthorized" });
  const body = req.body;
  const val = validateRequest(body, ["numbers"]);
  if (val) return res.status(400).send(val);
  return res.sendStatus(200);
});

module.exports = {
  GetApiApp,
  CreateApiApp,
};
