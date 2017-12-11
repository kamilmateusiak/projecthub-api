var User = require('../models/userModel');
const node_acl = require('../../services/acl').getAcl();
var _ = require('lodash');

exports.register = (req, res, next) => {
  var body = _.pick(req.body, ['email', 'password', 'name', 'surname'])
  var user = new User(body)
  console.log(user)
  user.roles = ['user']

  user.save()
    .then((newUser) => {
      return node_acl.addUserRoles(newUser.id, newUser.roles)
    })
    .then(() => {
      return user.generateAuthToken()
    })
    .then((token) => {
      res.header('x-auth', token).header('Access-Control-Expose-Headers', 'x-auth').send(user)
    })
    .catch((e) => {
      res.status(400).send(e)
    })
}

exports.me = (req, res, next) => {
  res.send(req.user)
}

exports.login = (req, res, next) => {
  var body = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      return user.generateAuthToken()
        .then((token) => {
          res.header('x-auth', token).header('Access-Control-Expose-Headers', 'x-auth').send(user)
        })
    })
    .catch((e) => {
      res.status(400).send()
    })
}

exports.logout = (req, res, next) => {
  req.user.removeToken(req.token)
   .then(() => {
      res.status(200).send()
    })
    .catch((e) => {
      res.status(400).send()
    }) 
}

exports.get = (req, res, next) => {
  User.find({})
    .then(function(users){
      let resUsers = _.map(users, (o) => {
        return _.pick(o, ['email', 'name', 'surname', '_id'])
      })
      res.json(resUsers);
    }, function(err){
      next(err);
    });
};
