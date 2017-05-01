const router = require('express').Router();
const controller = require('../controllers/eventController');

router.param('id', controller.params);

router.route('/')
  .post(controller.post)

router.route('/:id')
  .put(controller.put)
  .delete(controller.delete)  

module.exports = router;
