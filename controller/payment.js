// get a payment by ID
// get latest payment by walletID

const { WrapHandler } = require("../middlewares/app");
const paymentModel = require("../models/paymentModel");

const GetPayment = WrapHandler(async (req, res) => {
    const { paymentID } = req.params;
    const payment = await paymentModel.findOne({
        paymentID,
    });
    if (!payment)
        return res.status(400).send({
            message: "Payment not found",
            success: false,
        });
    return res.status(200).json(payment);
});
module.exports = {
    GetPayment
}