var mkdirp = require('mkdirp');
//var fs = require('fs');

var teamNumber = process.argv[2];

mkdirp('team_' + teamNumber, function (err) {
if (err) console.error(err);
});