// environment config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  PORT: process.env.PORT
};