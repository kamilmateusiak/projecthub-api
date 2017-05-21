const express = require('express');
const config = require('../config/config');
const mongoose = require('mongoose');
const bluebird = require('bluebird');

const app = express();

mongoose.Promise = bluebird;
// mongod --dbpath /home/vagabondi/Pulpit/mongo
// "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath E:\repos\mongodb\data
mongoose.connect(config.db.url)

mongoose.connection.on('connected', function (test) {
    require('./services/acl').init();
})

mongoose.connection.on('error', function() {
	console.log('There is an issue with your MongoDB connection.  Please make sure MongoDB is running.');
	process.exit(1);
});

if (config.seed) {
    require('./services/seed');
}

require('./middleware/appMiddleware')(app)

app.use('/api', require('./api/api'));

module.exports = app;