// const Flutterwave = require('flutterwave-node-v3');
// const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
exports.verifyTransactionID = async (flw, trxId) => {
    return {
        success: true,
        "status": "success",
        "message": "Transaction fetched successfully",
        "data": {
          "id": 288200108,
          "tx_ref": "LiveCardTest",
          "flw_ref": "YemiDesola/FLW275407301",
          "device_fingerprint": "N/A",
          "amount": 100,
          "currency": "NGN",
          "charged_amount": 100,
          "app_fee": 1.4,
          "merchant_fee": 0,
          "processor_response": "Approved by Financial Institution",
          "auth_model": "PIN",
          "ip": "::ffff:10.5.179.3",
          "narration": "CARD Transaction ",
          "status": "successful",
          "payment_type": "card",
          "created_at": "2020-07-15T14:31:16.000Z",
          "account_id": 17321,
          "card": {
            "first_6digits": "232343",
            "last_4digits": "4567",
            "issuer": "FIRST CITY MONUMENT BANK PLC",
            "country": "NIGERIA NG",
            "type": "VERVE",
            "token": "flw-t1nf-4676a40c7ddf5f12scr432aa12d471973-k3n",
            "expiry": "02/23"
          },
          "meta": null,
          "amount_settled": 1000,
          "customer": {
            "id": 216519823,
            "name": "Yemi Desola",
            "phone_number": "N/A",
            "email": "user@gmail.com",
            "created_at": "2020-07-15T14:31:15.000Z"
          }
        }
    }
  try {
    const payload = { id: trxId };
    const response = await flw.Transaction.verify(payload);
    return {
      success: true,
      ...response,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};
exports.createFlutterwaveVirtualAccount = async (flw, payload) => {
  // return {
  //   success: true,
  //   status: "success",
  //   message: "Virtual account created",
  //   data: {
  //     response_code: "02",
  //     response_message: "Transaction in progress",
  //     flw_ref: "MockFLWRef-1690858044415",
  //     order_ref: "URF_1690858044280_6411035",
  //     account_number: "0067100155",
  //     account_status: "active",
  //     frequency: 1,
  //     bank_name: "Mock Bank",
  //     created_at: 1690858044415,
  //     expiry_date: 1690858044415,
  //     note: "Mock note",
  //     amount: payload.amount + 14,
  //   },
  // };
  try {
    const create = await flw.VirtualAcct.create(payload);
    return {
      success: create.status !== "error",
      ...create,
    };
  } catch (err) {
    return {
      success: false,
      message: err,
    };
  }
};