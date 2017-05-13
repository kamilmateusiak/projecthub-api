var router = require('express').Router();

router.use('/projects', require('./routes/projectRoutes'));
router.use('/events', require('./routes/eventRoutes'));
router.use('/users', require('./routes/userRoutes'))

module.exports = router;