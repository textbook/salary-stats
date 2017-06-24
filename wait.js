'use strict';
var waitOn = require('wait-on');
var testPort = parseInt(process.env.PORT || '4200', 10);

var opts = {
  resources: ['http-get://localhost:' + testPort],
  delay: 5000,
  interval: 500,
  timeout: 60000,
  log: true
};

waitOn(opts, function (err) {
  if (err) {
    process.exit(1);
  }
  process.exit();
});
