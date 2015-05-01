var http = require('http');
var file = require('read-file');

var auth = file.readFileSync('authkey.txt');

var options = {
  host: frc-staging-api.usfirst.org
  Authorization: auth
};
