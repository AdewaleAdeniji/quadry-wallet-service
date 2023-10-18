// fetch user by email
// fetch user by userID
// create user
// update user

const logModel = require("../models/db-store.js");

exports.createlog = async (log) => {
  return await logModel.create(log);
};
exports.getlogByID = async (logID) => {
  return await logModel.findOne({
    logID,
  });
};

