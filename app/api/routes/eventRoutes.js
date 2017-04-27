const router = require('express').Router();
const controller = require('../controllers/eventController');

router.param('id', controller.params);

router.route('/')
  .post(controller.post)

router.route('/:id')
  .delete(controller.delete)  

module.exports = router;
