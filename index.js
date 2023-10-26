const express = require("express");
const app = express();
const cors = require("cors");
// const middlewares = require("./middlewares/user");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { CreateApiApp } = require("./controller/apiApps");
const { validateApp, validateAppID } = require("./middlewares/app");
const appRouter = require("./routes/app.routes");
const walletRouter = require("./routes/wallets.routes");
const {
  FlutterwaveWebhook,
  NewFlutterwaveWebhook,
} = require("./controller/webhook");
require("dotenv").config();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(function (error, _, res, next) {
  //Catch json error
  if (error) {
    return res.status(400).send({ message: "Invalid Request" });
  }
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post("/apps/create", CreateApiApp);
app.use("/apps", validateApp, appRouter);
app.use("/wallets", validateAppID, walletRouter);

app.post("/flutterwave/hook", NewFlutterwaveWebhook);

app.get("/health", (_, res) => {
  return res.status(200).send("OK");
});
app.get("*", (_, res) => {
  return res.status(404).send("Not found");
});
app.post("*", (_, res) => {
  return res.status(404).send("Not found");
});

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost/CRUD", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.K_DB || "dev-lauvote", // specify the database name here
  })
  .then(() => console.log("connected to mongodb"))
  .catch(() => console.log("error occured connecting to mongodb"));

app.listen(process.env.PORT || 4050, () => {
  console.log("Server is running on port 4050");
});
