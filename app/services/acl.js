var acl = require('acl');
var mongoose = require('mongoose');

acl = new acl(new acl.mongodbBackend(mongoose.connection.db, 'acl_'))

module.exports = {
    init: function() {
        acl.addRoleParents( 'user', 'guest' );
        acl.addRoleParents( 'admin', 'user' );

        acl.allow([
            {
                roles: ['admin'],
                allows: [
                    { resources: [ '/api/projects/', '/api/projects/:name' ], permissions: '*' },
                    { resources: [ '/api/events/', '/api/events/:id' ], permissions: '*' }
                ]
            }, {
                roles: ['user'],
                allows: []
            }, {
                roles: ['guest'],
                allows: [
                    { resources: [ '/api/users/me', '/api/users/register', '/api/users/logout', '/api/users/login', '/api/users/all' ], permissions: '*' },
                    { resources: [ '/api/projects/', '/api/projects/:name' ], permissions: 'get' }
                ]
            }
        ]);
    },

    getAcl: function() {
        return acl;
    }
};
