const router = require('express').Router();
const controller = require('../controllers/projectController');
const node_acl = require('../../services/acl').getAcl()
const getUserId = require('../../services/utility').getUserId

router.param('name', controller.params);

router.route('/')
  .get(controller.get)
  .post(node_acl.middleware(2, getUserId(req, res)), controller.post)

router.route('/:name')
  .get(controller.getOne)


module.exports = router;
