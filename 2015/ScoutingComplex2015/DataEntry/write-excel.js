var xlsx = require('xlsx');
var http = require('http');
var file = require('read-file');

var pathname = __dirname.substring(0, __dirname.lastIndexOf('/'));

var auth = file.readFileSync(pathname + '/authkey.txt');
var mkdirp = require('mkdirp');
var fs = require('fs');

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
  };

  http.request(options, callback).end();
}

//get the team numbers of all the teams attending an event
function genTeamArray(teamData){

  var teams = teamData.teams;

  var teamNumbers = [];

  for(var x = 0; x < teams.length; x++){
    var currentTeam = teams[x].teamNumber;

    teamNumbers.push(currentTeam);
  }

  generateExcelBook(teamNumbers);
  createFolders(teamNumbers);
}

//workBook class
function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

//generate excel file for event
function generateExcelBook(teamNumbers){
  var exportBook = new Workbook();

  for(var x = 0; x < teamNumbers.length; x++){
    var current = teamNumbers[x];
    exportBook.SheetNames.push("" + current);
    exportBook.Sheets["" + current] = getTemplate();
  }
  makeFile(exportBook);
}

//gets the template scouting sheet
function getTemplate(){
  var wb = xlsx.readFile(__dirname + '/sample_files/template.xlsx');
  var ws = wb.Sheets.Sheet1;
  ws['!cols'] = getCols(ws);
  return ws;
}

function getCols(ws){
  var range = xlsx.utils.decode_range(ws['!ref']);
  var wcols = [];

  for(var col = range.s.c; col <= range.e.c; col++){
    var smallest = 0;
    for(var row = range.s.r; row <= range.e.r; row++){
      var cellRef = xlsx.utils.encode_cell({r: row, c: col});
      var cell = ws[cellRef];
      //console.log(cell);
      if(typeof cell !== 'undefined'){
        cell = cell.v;
        //console.log(cell);
        if(cell.length > smallest) smallest = cell.length;
      }
    }
    if(smallest !== 0) wcols.push({wch: smallest});
  }

  //console.log(wcols);
  return wcols;
}

//make a team folder for every team at the competition
function createFolders(teamArray){
  for(var x = 0; x < teamArray.length; x++){
    var current = teamArray[x];

    makeTeamFolder(current);
  }
}

//given the teamNumber, make the folder to store the JSON
function makeTeamFolder(teamNumber){
  mkdirp(pathname + '/collectedJSON/team_' + teamNumber, function (err) {
    if (err) console.error(err);
  });
}

//writes the excel file
function makeFile(exportBook){
  xlsx.writeFile(exportBook, __dirname + '/scouting.xlsx');
}

//calls all the other functions to generate the scouting sheet
function generateScoutingSheet(eventCode){
  getTeams(eventCode);
}

module.exports = {
	write: generateScoutingSheet
};