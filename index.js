const config = require('./config/config');
const app = require('./app/server');



app.listen(config.port, function () {
  console.log('listening on http://localhost:' + config.port);
});
