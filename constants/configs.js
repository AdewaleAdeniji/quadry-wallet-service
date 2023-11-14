require("dotenv").config();

const USE_TEST_KEYS = false //process.env.USE_TEST_KEYS || true;
exports.configs = {
  testKeys: USE_TEST_KEYS,
  FLUTTERWAVE_PUBKEY: USE_TEST_KEYS
    ? process.env.TEST_FLUTTERWAVE_PUBKEY
    : process.env.FLUTTERWAVE_PUBKEY,
  FLUTTERWAVE_SECKEY: USE_TEST_KEYS
    ? process.env.TEST_FLUTTERWAVE_SECKEY
    : process.env.FLUTTERWAVE_SECKEY,
};
