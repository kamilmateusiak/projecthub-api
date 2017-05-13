var User = require('../models/userModel');
var _ = require('lodash');

exports.register = (req, res, next) => {
  var body = _.pick(req.body, ['email', 'password'])
  var user = new User(body)

  user.save()
    .then(() => {
      return user.generateAuthToken()
    })
    .then((token) => {
      res.header('x-auth', token).send(user)
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
          res.header('x-auth', token).send(user)
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
