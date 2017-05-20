const express = require('express');
const config = require('../config/config');
const api = require('./api/api');
const mongoose = require('mongoose');
const bluebird = require('bluebird')
const node_acl = require( 'acl' )
let acl

const app = express();

mongoose.Promise = bluebird;
// mongod --dbpath /home/vagabondi/Pulpit/mongo
// "C:\Program Files\MongoDB\Server\3.4\bin\mongod.exe" --dbpath E:\repos\mongodb\data
mongoose.connect(config.db.url, function() {
    require('./services/acl').init();
})

if (config.seed) {
    require('./services/seed');
}

require('./middleware/appMiddleware')(app)

app.use('/api', api);

module.exports = app;