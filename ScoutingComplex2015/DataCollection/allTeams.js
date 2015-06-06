var requestService = require('./QRequest.js');
var http = require('http');
var file = require('read-file');
var Q = require('q');
var mkdirp = require('mkdirp');
var fs = require('fs');



//this is the authorization key
var auth = file.readFileSync('../authkey.txt');

//call the FIRST api and get a list of all the teams enrolled this year
function getRawTeamInfo(season){
	var teamListPromise = Q.defer();

	var options = {
    host: 'private-945e3-frcevents.apiary-proxy.com',
    path: '/api/v1.0/teams/' + '' + season,
    headers: {
      	Authorization: 'Basic ' + auth
    	}
  	};

  	callback = function(response) {
    var str = '';


    response.on('data', function(chunk) {
      str += chunk;
    });
    response.on('end', function() {
      var teamList = JSON.parse(str);
      teamListPromise.resolve(teamList);
      
      //storeEventData(teamNumber, parsedEventData);
    });
  };

  http.request(options, callback).end();
  return teamListPromise.promise;
}

function parseTeams(teamList){
  var teamNumberArrayPromise = Q.defer();

  var teamNumberArray = [];

  var x;
  for(x = 0; x < teamList.teams.length; x++){
    teamNumberArray.push(teamList.teams[x].teamNumber);
  }

  teamNumberArrayPromise.resolve(teamNumberArray);

  return teamNumberArrayPromise.promise;
}

function storeData(teamNumber){

  var teamObject = requestService.getTeamObject(teamNumber);


  teamObject
  .then(function(data){
    console.log(data);
    makeTeamFolder(teamNumber);
    writeRaw(teamNumber, data);
    console.log('written');
  });
}

function writeRaw(teamNumber, payload){
  var outputFilename = '../collectedJSON/team_' + teamNumber + '/seasonData.json';

  fs.writeFile(outputFilename, JSON.stringify(payload, null, 4), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFilename);
      }
  });
}

//given the teamNumber, make the folder to store the JSON
function makeTeamFolder(teamNumber){
  mkdirp('../collectedJSON/team_' + teamNumber, function (err) {
    if (err){
      console.error(err);
    } else{
      console.log('make folder!');
    }
  });
}

//@TODO: Eventually turn this into a function that can be called
var rawTeamInfo = getRawTeamInfo(2015);

rawTeamInfo
.then(function(teamList){
	return parseTeams(teamList);
})
.then(function(teamNumberArray){
  var x;
  for(x = 0; x < teamNumberArray.length; x++){
    storeData(teamNumberArray[x]);
  }
});









//