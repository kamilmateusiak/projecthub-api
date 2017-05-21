var router = require('express').Router();
var auth = require('../../middleware/auth')
var controller = require('../controllers/userController');

router.route('/me')
  .get(auth.authenticate, controller.me)

router.route('/register')
  .post(controller.register)

router.route('/logout')
  .delete(auth.authenticate, controller.logout)

router.route('/login')
  .post(controller.login)

router.route('/all')
  .get(controller.get)

module.exports = router;
