const config = require('./config/config');
const app = require('./app/server');
var http = require('http');

app.set('port', config.port);

var server = http.createServer(app);

server.listen(config.port, function () {
  console.log('listening on http://localhost:' + config.port);
});
