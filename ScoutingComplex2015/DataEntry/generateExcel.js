var xlsx = require('xlsx');
var http = require('http');
var file = require('read-file')
var auth = file.readFileSync('../authkey.txt');

//get all the teams attending an event
function getTeams(eventCode){
  var options = {
    host: 'private-945e3-frcevents.apiary-proxy.com',
    path: '/api/v1.0/teams/2015?eventCode=' + eventCode,
    headers:
      {Authorization: 'Basic ' + auth}
  };
  callback = function(response) {
    var str = '';


    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      var teams = JSON.parse(str);
      genTeamArray(teams);
    });
  }

  http.request(options, callback).end();
}

//get the team numbers of all the teams attending an event
function genTeamArray(teamData){
  var teams = teamData['teams'];
  var teamNumbers = [];

  for(var x = 0; x < teams.length; x++){
    var currentTeam = teams[x]['teamNumber'];

    teamNumbers.push(currentTeam);
  }

  console.log(teamNumbers);
  generateExcelBook(teamNumbers);
}

//workBook class
function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

//generate excel file for event
function generateExcelBook(teamNumbers){
  
}




getTeams('NJFLA')
