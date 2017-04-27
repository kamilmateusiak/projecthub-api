var router = require('express').Router();

router.use('/projects', require('./routes/projectRoutes'));
router.use('/events', require('./routes/eventRoutes'));


module.exports = router;