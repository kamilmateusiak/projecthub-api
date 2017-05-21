const {ObjectID} = require('mongodb')
const node_acl = require('./acl').getAcl()



exports.getUserId = function (req, res) {
	if (typeof req.headers['user-id'] !== 'undefined') {
    node_acl.isAllowed('59216ad4b8cc1b350c86b6aa', '/api/projects/', 'get', function (err, isAllowed) {
      if(isAllowed) {
        console.log('allowed')
      } else {
        console.log('not allowed')
      }
    })
    console.log(req.originalUrl)


    console.log(JSON.parse(req.headers['user-id']).replace(/."/, ''))
		return JSON.parse(req.headers['user-id']).replace(/."/, '')
	}
	return '';
};