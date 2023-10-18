const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appsSchema = new Schema(
  {
    appID: {
      type: String,
      immutable: true,
    },
    appToken: String,
    appName: String,
    appMasterWalletID: String,
    appKeys: {
        type: Object,
        default: {
            public: "",
            secret: "",
        }
    },
    appConfigs: {
      type: Object,
      default: {
        useDefaultFlutterwaveKey: true,
        flutterwaveKey: {},
      },
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("api-apps", appsSchema);
