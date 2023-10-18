const { getApiApp } = require("../services/apiApps");
const utils = require("../utils");

const validateApp = async (req, res, next) => {
  const headers = req.headers;
  const authorization = headers.authorization;
  if (!authorization) {
    return res.status(403).send({ message: "Forbidden access, login first" });
  }
  //validate the token itself
  const val = await utils.verifyToken(authorization.split(" ")[1]);
  if (!val) {
    return res.status(403).send({ message: "Access expired, login first" });
  }
  req.appID = val.payload.appID;
  req.app = val.payload;
  next();
};
const validateAppID = async (req, res, next) => {
  const headers = req.headers;
  const authorization = headers.authorization;
  if (!authorization) {
    return res.status(403).send({ message: "Forbidden access, login first" });
  }
  //validate the token itself
  const val = await utils.verifyToken(authorization.split(" ")[1]);
  if (!val) {
    return res.status(403).send({ message: "Access expired, login first" });
  }
  const appID = val.payload.appID;
  // call app id
  const app = await getApiApp(appID);

  if (!app)
    return res
      .status(403)
      .send({ message: "Forbidden API access, login first" });
  req.appID = appID;
  req.app = val.payload;
  next();
};
const validateRequest = (obj, keys) => {
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const words = key.split(/(?=[A-Z])/); // Split the key based on capital letters
    const humanReadableKey = words.join(" "); // Join the words with spaces
    const formattedKey =
      humanReadableKey.charAt(0).toUpperCase() + humanReadableKey.slice(1); // Capitalize the first letter
    if (!(key in obj)) {
      return { message: `${formattedKey} is required` };
    }
    if (obj[key] === "") {
      return { message: `${formattedKey} is empty` };
    }
  }
  return false;
};
const WrapHandler = (controllerFn) => {
  return async (req, res, next) => {
    try {
      await controllerFn(req, res, next);
    } catch (err) {
      console.log(err);
      if (err.code === 11000) {
        return res
          .status(500)
          .json({
            message:
              "This payload contains a key that is expected to be unique but it's not ",
          });
      }
      return res.status(500).json({ message: err.message });
    }
  };
};

module.exports = {
  validateApp,
  validateRequest,
  WrapHandler,
  validateAppID,
};
