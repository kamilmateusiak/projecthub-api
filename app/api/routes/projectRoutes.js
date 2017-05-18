const router = require('express').Router();
const controller = require('../controllers/projectController');

router.param('name', controller.params);

router.route('/')
  .get(controller.get)
  .post((req, res, next) => { console.log(req.acl); next() }, controller.post)

router.route('/:name')
  .get(controller.getOne)


module.exports = router;
