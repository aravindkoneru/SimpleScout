var prompt =require('sync-prompt').prompt;
var scouting = require('./scouting.js')

var teamNumb = prompt("Enter team number in the following format (frcyyy): ");

scouting.getData(teamNumb);
