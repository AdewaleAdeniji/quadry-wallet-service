const express = require("express");
const { CreateApiApp, GetApiApp } = require("../controller/apiApps");

const appRouter = express.Router();

appRouter.route("/app").get(GetApiApp)

module.exports = appRouter;