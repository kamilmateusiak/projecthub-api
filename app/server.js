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
mongoose.connect(config.db.url, function ( error ) {
    var mongoBackend = new node_acl.mongodbBackend( mongoose.connection.db, 'acl_' )

    acl = new node_acl( mongoBackend );

    acl.allow([
        {
            roles: 'admin',
            allows: [
                { resources: [ '/api/projects', '/api/projects/:name' ], permissions: '*' },
                { resources: [ '/api/events', '/api/events/:id' ], permissions: '*' }
            ]
        }, {
            roles: 'user',
            allows: []
        }, {
            roles: 'guest',
            allows: [
              { resources: [ '/api/users/me', '/api/users/register', '/api/users/logout', '/api/users/login', '/api/users/all' ], permissions: '*' },
              { resources: [ '/api/projects', '/api/projects/:name' ], permissions: 'get' }
            ]
        }
    ]);
    
    acl.addRoleParents( 'user', 'guest' );
    acl.addRoleParents( 'admin', 'user' );

    if (config.seed) {
        require('./services/seed')(acl);
    }
});

require('./middleware/appMiddleware')(app)

app.use( function( req, res, next) {
  req.acl = acl;
  next();
}); 

app.use('/api', api);

module.exports = app;