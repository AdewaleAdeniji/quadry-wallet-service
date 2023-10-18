const { configs } = require("../constants/configs");
const { getApiApp } = require("../services/apiApps");

const defaultFlutterwaveConfig = {
  FLW_PUBLIC_KEY: configs.FLUTTERWAVE_PUBKEY,
  FLW_SECRET_KEY: configs.FLUTTERWAVE_SECKEY,
};
const getConfig = async (appID) => {
  const app = await getApiApp(appID);
  //onsole.log(app, appID);
  if (!app) return false;
  const useDefault = app.appConfigs.useDefaultFlutterwaveKey;
  if (useDefault)
    return {
      masterWallet: app.appMasterWalletID,
      ...app.appConfigs,
      flutterwaveKey: defaultFlutterwaveConfig,
    };
  return { masterWallet: app.appMasterWalletID, ...app.appConfigs };
};

module.exports = {
  getConfig,
};
