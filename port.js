'use strict';
const getPort = require('get-port');

getPort().then(function (port) {
  console.log(port);
  process.exit();
});
