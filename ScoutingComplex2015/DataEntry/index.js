var xlsx = require('xlsx');
var http = require('http');
var file = require('read-file');
var auth = file.readFileSync('../authkey.txt');
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
  var wb = xlsx.readFile('sample_files/template.xlsx');
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
  mkdirp('../collectedJSON/team_' + teamNumber, function (err) {
    if (err) console.error(err);
  });
}

//writes the excel file
function makeFile(exportBook){
  xlsx.writeFile(exportBook, 'scouting.xlsx');
}

//calls all the other functions to generate the scouting sheet
function generateScoutingSheet(eventCode){
  getTeams(eventCode);
}

/*
*********************************************************


                        END OF WRITE CODE



********************************************************
*/

var matchSchema = {
  interaction:{
    totes: "",
    bins: ""
  },
  actionsAttempted:{
    robotSet: "",
    containerSet: "",
    toteSet: "",
    stackedToteSet: ""
  },
  actionsCompleted:{
    compeltedRobotSet: "",
    completedContainerSet: "",
    completedToteSet: "",
    completedStackedToteSet: ""
  },
  teleOp:{
    totesStacked: "",
    totesHP: "",
    totesLandfill: ""
  },
  binStacks:{
    size1: "",
    size2: "",
    size3: "",
    size4: "",
    size5: "",
    size6: ""
  },
  coop: {
    obtained: "",
    step: ""
  }
};

var found = false;

//gets the raw data from one sheet
function genInfo(location, teamNumber){
  var wb = xlsx.readFile(location);
  return getTeamPayload(wb, teamNumber);
}

//returns a team payload containing all the scouting data
function getTeamPayload(excelBook, teamNumber){
  var ws = excelBook.Sheets["" + teamNumber];
  var range = xlsx.utils.decode_range(ws["!ref"]);
  var payload = [];
  var keySet = genKeySet(matchSchema);

  for(var row = 2; row <= range.e.r; row++){
    var currentPos = 0;
    for(var col = 0; col <= range.e.c; col++){
      found = false;
      var cellRef = xlsx.utils.encode_cell({r: row, c: col});
      var cell = ws[cellRef];
      //console.log(keySet[currentPos]);

      if(typeof cell === 'undefined'){
        setValue(matchSchema, keySet[currentPos], 'undefined');
        currentPos++;
      } else if(typeof cell !== 'undefined' && cell.t === 'n'){
        //console.log(keySet[currentPos] + ' : ' + cell.v);
        setValue(matchSchema, keySet[currentPos], cell.v);
        currentPos++;
      } else if(typeof cell !== 'undefined' && cell.t === 's'){
        //console.log(keySet[currentPos] + ' : ' + cell.v);
        setValue(matchSchema, keySet[currentPos], true);
        currentPos++;
      }
    }
    //console.log(matchSchema);
    payload.push(JSON.parse(JSON.stringify(matchSchema)));
    setDefault(matchSchema);
  }
  //console.log(payload)
  return payload;
}

//sets the matchSchema to default for another entry
function setDefault(rawObj){
  //console.log(rawObj);
  for(var key in rawObj){
    if(rawObj.hasOwnProperty(key) && typeof rawObj[key] === 'object'){
      setDefault(rawObj[key]);

    } else if(rawObj.hasOwnProperty(key)){
      rawObj[key] = '';
    }
  }
  return rawObj;
}

//sets the value for an attribute
function setValue(rawObj, findKey, value){
  for(var key in rawObj){
    if(rawObj.hasOwnProperty(key) && typeof rawObj[key] === 'object'){
      setValue(rawObj[key], findKey, value);

    } else if(rawObj.hasOwnProperty(key) && key === findKey && found === false && rawObj[key] === ''){
      rawObj[key] = value;
      found = true;
    }
  }
}

//generates a keyset based of off the match schema
function genKeySet(rawObj){
  var keySet = [];
  for(var key in rawObj){
    if(rawObj.hasOwnProperty(key) && typeof rawObj[key] === 'object'){
      keySet = combine(keySet, genKeySet(rawObj[key]));
    } else if(rawObj.hasOwnProperty(key)){
      keySet.push(key);
    }
  }
  return keySet;
}

//combines two arrays
function combine(a, b){
  for(var x = 0; x < b.length; x++){
    a.push(b[x]);
  }
  return a;
}

//reads all of the sheets and sends the data to be written
function genInfoAll(location){
  var wb = xlsx.readFile(location);
  var sheets = wb.SheetNames;

  for(var x = 0; x < sheets.length; x++){
    var teamNumber = parseInt(sheets[x]);

    var payload = getTeamPayload(wb, teamNumber);
    writeDataPoints(teamNumber, payload);
    writeRaw(teamNumber, payload);
  }
}

function writeRaw(teamNumber, payload){
  var outputFilename = '../collectedJSON/team_' + teamNumber + '/payload.json';

  fs.writeFile(outputFilename, JSON.stringify(payload, null, 4), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFilename);
      }
  });
}

//converts the payload into graph ready data and writes to a file
function writeDataPoints(teamNumber, teamPayload){
  var dataPoints = {};

  for(var x = 0; x < teamPayload.length; x++){
    var current = teamPayload[x];

    for(var key in current){
      if(current.hasOwnProperty(key)){//outer keys (1st row headers)
        var inner  = current[key];

        for(var key2 in inner){
          if(inner.hasOwnProperty(key2)){//inner headers (actual data)

            if(typeof dataPoints[key2] === 'undefined'){//check if key not in dataPoints
              dataPoints[key2] = [];
            }

            dataPoints[key2].push(inner[key2]);

          }
        }

      }

    }
  }

  var outputFilename = '../collectedJSON/team_' + teamNumber + '/dataPoints.json';

  fs.writeFile(outputFilename, JSON.stringify(dataPoints, null, 4), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFilename);
      }
  });
}

function readExcel(location){
  genInfoAll(location);
}


/*
*********************************************************


                        END OF READ CODE



********************************************************
*/

module.exports =  {
  makeScoutingFile: function(eventCode){
    generateScoutingSheet(eventCode);
  },

  read: function(location){
    readExcel(location);
  }
};
