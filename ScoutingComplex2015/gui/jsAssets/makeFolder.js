var mkdir = require('mkdir');

var teamNumber = process.argv[2];

mkdirp('../../collectedJSON/team_' + teamNumber, function (err) {
if (err) console.error(err);
});