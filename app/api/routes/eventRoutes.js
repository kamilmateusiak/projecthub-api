const router = require('express').Router();
const controller = require('../controllers/eventController');
const utility = require('../../services/utility')
const acl = require('../../services/acl').getAcl();
const customAclMiddleware = require('../../middleware/customAclMiddleware')

router.param('id', controller.params);

router.route('/')
  .post(customAclMiddleware, controller.post)

router.route('/:id')
  .put(customAclMiddleware, controller.put)
  .delete(customAclMiddleware, controller.delete)  

module.exports = router;
