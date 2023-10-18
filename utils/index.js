const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const LogModel = require("../models/LogModel");

async function logAction(type, content, username, number) {
  return await LogModel.create({
    type,
    content,
    number,
    username,
  });
}
const createHash = async function (plainTextPassword) {
  // return password hash
  return await argon2.hash(plainTextPassword);
};
const generateID = () => {
  const timestamp = new Date().getTime().toString(); // get current timestamp as string
  const random = Math.random().toString().substr(2, 5); // generate a random string of length 5
  const userId = timestamp + random; // concatenate the timestamp and random strings
  return userId;
};
const generateKey = (public) => {
  const keyString = generateID();
  const keyStringTwo = generateID();
  const append = public ? "PUBK" : "SECK";
  return append + keyString + "" + keyStringTwo;
};
const convertPhoneToISO = (number, countryCode = "234") => {
  if (!number) return "";
  if (number.substring(0, 4) === `+${countryCode}`) {
    return number;
  } else if (number.substring(0, 3) === countryCode) {
    return `+${number}`;
  } else if (number.charAt(0) === "0") {
    return `+${countryCode}${number.slice(1)}`;
  } else {
    return null;
  }
};
// Method to validate the entered password using argon2
const validateHash = async function (hashed, candidatePassword) {
  return await argon2.verify(hashed, candidatePassword);
};
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const signToken = (data) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  const payload = { payload: data };
  payload.date = Date.now();

  return jwt.sign(payload, jwtSecretKey);
};
const verifyToken = async (token) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      return verified;
    } else {
      // Access Denied
      return false;
    }
  } catch (error) {
    // Access Denied
    return false;
  }
};

function isValidObject(json) {
  if (typeof json !== "object" || json === null || Array.isArray(json)) {
    return false;
  }

  try {
    JSON.stringify(json);
  } catch (e) {
    return false;
  }

  return true;
}

const generateOTP = () => {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

module.exports = {
  verifyToken,
  signToken,
  createHash,
  validateHash,
  generateID,
  generateOTP,
  isValidObject,
  isValidEmail,
  logAction,
  convertPhoneToISO,
  generateKey
};
