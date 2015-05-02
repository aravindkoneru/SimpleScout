var http = require('http');
var file = require('read-file');

//'Basic ' + new Buffer(username + ':' + password).toString('base64');

var auth = file.readFileSync('authkey.txt');


var options = {
  host: 'private-945e3-frcevents.apiary-proxy.com',
  path: '/api/v1.0/2015',
  headers:
    {Authorization: 'Basic ' + auth}
};

callback = function(response) {
  var str = '';


  response.on('data', function(chunk) {
    str += chunk;
  });

  response.on('end', function() {
    console.log(str);
  });
}

http.request(options, callback).end();
