const AppModel = require("../models/appModels");

exports.createApiApp = async (app) => {
  return await AppModel.create(app);
};

exports.getApiApp = async (appID) => {
  return await AppModel.findOne({
    appID,
  });
};
