var http = require('http');
var file = require('read-file');
var auth = file.readFileSync('../authkey.txt');
var Q = require('q');

//var teamData = {};


function getEvents(teamNumber){
  var deffered = Q.defer();


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
      deffered.resolve(parsedEventData);
      //storeEventData(teamNumber, parsedEventData);
    });
  };

  http.request(options, callback).end();
  return deffered.promise;
}

function storeEventData(teamNumber, parsedEventData){
  var teamData = {};
  var teamDataPromise = Q.defer();

  teamData.events = {};
  for(var x = 0; x < parsedEventData.Events.length; x++){
    var current = parsedEventData.Events[x];
    if(current.name !== "FIRST Championship"){
      teamData.events[current.code] = {};
      teamData.events[current.code].event_name = current.name;
    }
  }

  teamData.analytics = {};


  for(var eventCode in teamData.events){
    if(teamData.events.hasOwnProperty(eventCode)){

      var dataPromise; //= populateRawScore(teamData, teamNumber, eventCode);
/*
      dataPromise
      .then(function(data){
        teamData = data;
        //console.log(data);
      });
      */

      dataPromise =populateMatchData(teamData, teamNumber, eventCode);

      dataPromise
      .then(function(data){
        teamData = data;
        //console.log(data);
      });

    //  returnPromise.resolve(teamData);

      //getRawScores(teamNumber, eventCode);
      //getMatches(teamNumber, eventCode);
    }
  }

  teamDataPromise.resolve(teamData);
  return teamDataPromise.promise;
}


function populateRawScore(teamData, teamNumber, eventCode){

  var teamDataPromise = Q.defer();

  var rawScorePromise = getRawScores(teamNumber, eventCode);
  rawScorePromise
  .then(function(data){
    //console.log('got this from: ' + JSON.stringify(data));
    storeScoreData(teamData, eventCode, data);
  })
  .then(function(data){
    console.log('this');
    teamDataPromise.resolve(teamData);
  });

  return teamDataPromise.promise;
  //console.log(teamData);
}

function populateMatchData(teamData, teamNumber, eventCode){
  var matchDataPromise = Q.defer();

  var rawMatches = getMatches(teamNumber, eventCode);

  rawMatches
  .then(function(data){
    //console.log(JSON.stringify(data))
    storeMatchData(teamData, eventCode, data);
  })
  .then(function(data){
    console.log(JSON.stringify(data));
    matchDataPromise.resolve(data);
  });

  return matchDataPromise.promise;
}

function getRawScores(teamNumber, eventCode){
  var deferred = Q.defer();

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
      deferred.resolve(parsedScoreData);
      //storeScoreData(eventCode, parsedScoreData);
    });
  };

  http.request(options, callback).end();
  return deferred.promise;
}

function storeScoreData(teamData, eventCode, parsedScoreData){
  var storeScorePromise = Q.defer();

  var rawStats = parsedScoreData.Rankings[0];

  teamData.events[eventCode].raw_stats = {};

  for(var key in rawStats){
    if(rawStats.hasOwnProperty(key)){
      teamData.events[eventCode].raw_stats[key] = rawStats[key];
    }
  }

  storeScorePromise.resolve(teamData);
  return storeScorePromise.promise;
}

function getMatches(teamNumber, eventCode){
  var rawMatches = Q.defer();

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
      rawMatches.resolve(rawMatchesObject);
      //storeMatchData(eventCode, rawMatchesObject);
    });
  };

  http.request(options, callback).end();
  return rawMatches.promise;
}

function storeMatchData(teamData, eventCode, rawMatchesObject){
  var teamDataPromise = Q.defer();
  var matches = rawMatchesObject.Matches[0];

  teamData.events[eventCode].matches = matches;
  //console.log(teamData.events[eventCode].matches === matches);

  teamDataPromise.resolve(teamData);
  return teamDataPromise.promise;
}



var promise = getEvents(1923);

promise
.then(function(data){//data is the event data from FIRST api
  return storeEventData(1923, data);
})
.then(function(data){//data is the rawTeamData json without any values
  console.log(data);
});
