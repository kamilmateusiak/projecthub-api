const node_acl = require( 'acl' )
let acl

function _mongo_acl( error, db ) {
    var mongoBackend = new node_acl.mongodbBackend( db, 'acl_' )

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
}
