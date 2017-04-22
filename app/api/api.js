var router = require('express').Router();

router.use('/projects', require('./routes/projectRoutes'));

module.exports = router;