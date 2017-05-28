var node_acl = require('../services/acl').getAcl();
var _ = require('lodash')

customAclMiddleware = (req, res, next) => {
  if (typeof req.headers['user-id'] !== 'undefined') {
    var id = JSON.parse(req.headers['user-id']).replace(/."/, '')
    
    var params
    var values

    if (!_.isEmpty(req.params)) {
      params = _.keys(req.params)
      values = _.values(req.params)
    } else {
      params = []
      values = []
    }
    
    var routeParts = req.originalUrl.split('/')
    var route = ''
    _.forEach(routeParts, (part) => {
      var indexInValuesArray = _.indexOf(values, part)
      if (indexInValuesArray !== -1) {
        part = ':' + params[indexInValuesArray]
        route += part
      } else {
        route += part + '/'
      } 
    })

    node_acl.isAllowed(id, route, req.method.toLowerCase(), function (err, isAllowed) {
      if(isAllowed) {
        next()
      } else {
        res.status(401).send({error: 'Not allowed'})
      }
    })
  }
}

module.exports = customAclMiddleware;