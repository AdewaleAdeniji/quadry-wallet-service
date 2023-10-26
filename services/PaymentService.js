const PaymentModel = require("../models/paymentModel");
const { generateID } = require("../utils");

exports.createPayment = async (payment) => {
  payment.paymentID = generateID();
  return await PaymentModel.create(payment);
};
exports.getPayment = async (paymentID) => {
  return await PaymentModel.findOne({
    paymentID,
  });
};
exports.getPaymentByAccountRef = async (accountRef) => {
  return await PaymentModel.findOne({
    accountRef,
  });
};
exports.updatePayment = async (payment) => {
  return await PaymentModel.findByIdAndUpdate(payment._id, payment);
};
