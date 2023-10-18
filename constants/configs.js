require("dotenv").config();

exports.configs = {
    FLUTTERWAVE_PUBKEY: process.env.FLUTTERWAVE_PUBKEY,
    FLUTTERWAVE_SECKEY: process.env.FLUTTERWAVE_SECKEY,
}