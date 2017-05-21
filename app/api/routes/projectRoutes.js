const router = require('express').Router();
const controller = require('../controllers/projectController');
const utility = require('../../services/utility')
const acl = require('../../services/acl').getAcl();
const customAclMiddleware = require('../../middleware/customAclMiddleware')

router.param('name', controller.params);
// acl.middleware(2, getUserId), 
router.route('/')
  .get(controller.get)
  .post(customAclMiddleware, controller.post)

router.route('/:name')
  .get(customAclMiddleware, controller.getOne)

module.exports = router;
