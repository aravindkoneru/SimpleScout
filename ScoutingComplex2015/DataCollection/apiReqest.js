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
    if(current.name !== "FIRST Championship"){
      teamData['events'][current.code] = {};
      teamData['events'][current.code]['event_name'] = current.name
    }
  }

  teamData['analytics'] = {};

  for(var eventCode in teamData['events']){
    if(teamData['events'].hasOwnProperty(eventCode)){
      getRawScores(teamNumber, eventCode);
      getMatches(teamNumber, eventCode);
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
      storeScoreData(eventCode, parsedScoreData);
    });
  }

  http.request(options, callback).end();
}

function storeScoreData(eventCode, parsedScoreData){
  var rawStats = parsedScoreData['Rankings'][0];

  teamData['events'][eventCode]['raw_stats'] = {};

  for(var key in rawStats){
    if(rawStats.hasOwnProperty(key)){
      teamData['events'][eventCode]['raw_stats'][key] = rawStats[key];
    }
  }
}

function getMatches(teamNumber, eventCode){
  var options = {
    host: 'private-945e3-frcevents.apiary-proxy.com',
    path: '/api/v1.0/matches/2015/' + eventCode + '?tournamentLevel=qual&teamNumber=' + teamNumber,
    headers:
      {Authorization: 'Basic ' + auth}
  };

  callback = function(response) {
    var str = '';


    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      var rawMatchesObject = JSON.parse(str);
      storeMatchData(eventCode, rawMatchesObject);
    });
  }

  http.request(options, callback).end();
}

function storeMatchData(eventCode, rawMatchesObject){
  var matches = rawMatchesObject['Matches'][0];

  teamData['events'][eventCode]['matches'] = matches;
}

scrapeTeamStats(1923);
var log = u.bind(console.log, console);
u.delay(log, 2500, teamData);
u.delay(analyze.calcData, 2000, teamData);
