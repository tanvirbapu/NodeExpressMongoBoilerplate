const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('./config/index');
mongoose.set("strictQuery", false);
const connect = mongoose.connect('mongodb://127.0.0.1:27017/dbByTanvir', { useNewUrlParser: true, useUnifiedTopology: true});
module.exports = connect;