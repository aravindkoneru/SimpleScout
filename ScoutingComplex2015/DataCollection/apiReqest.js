var http = require('http');
var file = require('read-file');
var u = require('underscore');
var analyze = require('../AnalyzeData/analyze');


//do not change this
var auth = file.readFileSync('../authkey.txt');

var teamData = {};

function scrapeTeamStats(teamNumber){
  getEvents(teamNumber);
}

function getEvents(teamNumber){
  var options = {
    host: 'private-945e3-frcevents.apiary-proxy.com',
    path: '/api/v1.0/events/2015?teamNumber=' + teamNumber,
    headers:
      {Authorization: 'Basic ' + auth}
  };

  callback = function(response) {
    var str = '';


    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      var parsedEventData = JSON.parse(str);
      storeEventData(teamNumber, parsedEventData);
    });
  }

  http.request(options, callback).end();
}


function storeEventData(teamNumber, parsedEventData){
  teamData['events'] = {};
  for(var x = 0; x < parsedEventData["Events"].length; x++){
    var current = parsedEventData["Events"][x];
    teamData['events'][current.code] = {};
    teamData['events'][current.code]['event_name'] = current.name
  }

  //console.log(teamData);
  for(var eventCode in teamData['events']){
    if(teamData['events'].hasOwnProperty(eventCode)){
      getRawScores(teamNumber, eventCode);
    }
  }
}

function getRawScores(teamNumber, eventCode){
  var options = {
    host: 'private-945e3-frcevents.apiary-proxy.com',
    path: '/api/v1.0/rankings/2015/' + eventCode + '?teamNumber=' + teamNumber,
    headers:
      {Authorization: 'Basic ' + auth}
  };

  callback = function(response){
    var str = '';

    response.on('data', function(chunk){
       str += chunk;
    });

    response.on('end', function(){
      var parsedScoreData = JSON.parse(str);
      storeScoreData(teamNumber, eventCode, parsedScoreData);
    });
  }

  http.request(options, callback).end();
}

function storeScoreData(teamNumber, eventCode, parsedScoreData){
  var rawStats = parsedScoreData['Rankings'][0];
  //console.log(rawStats);

  teamData['events'][eventCode]['raw_stats'] = {};
  //console.log(teamData['events'][eventCode]['raw_stats'])

  for(var key in rawStats){
    if(rawStats.hasOwnProperty(key)){
      teamData['events'][eventCode]['raw_stats'][key] = rawStats[key];
    }
  }

  //console.log(JSON.stringify(teamData));
}

scrapeTeamStats(1923);
var log = u.bind(console.log, console);
u.delay(log, 1000, teamData);
var args = [teamData, 'litterPoints'];
u.delay(analyze.sDev, 2000, args);
