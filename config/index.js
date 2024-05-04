const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT,
  databaseURL: process.env.MONGODB_URI,
  secret: process.env.JWT_SECRET,
  emailUsername: process.env.EMAIL_USERNAME,
  emailPassword: process.env.EMAIL_PASSWORD,
};