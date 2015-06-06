var http = require('http');
var file = require('read-file');
var auth = file.readFileSync('../authkey.txt');
var Q = require('q');

//Returns a promise of an object that contains all 
//of the events that a team has attended
function getEvents(teamNumber) {
  var deffered = Q.defer();


  var options = {
    host: 'private-945e3-frcevents.apiary-proxy.com',
    path: '/api/v1.0/events/2015?teamNumber=' + teamNumber,
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
      var parsedEventData = JSON.parse(str);
      deffered.resolve(parsedEventData);
      //storeEventData(teamNumber, parsedEventData);
    });
  };

  http.request(options, callback).end();
  return deffered.promise;
}

//Will return an skeleton object that has
//the events a team attended and a field for 
//analytics
function makeSkeleton(teamNumber, parsedEventData) {
  var teamData = {};
  var teamDataPromise = Q.defer();

  teamData.events = {};
  for (var x = 0; x < parsedEventData.Events.length; x++) {
    var current = parsedEventData.Events[x];
    if (current.name !== "FIRST Championship") {
      teamData.events[current.code] = {};
      teamData.events[current.code].event_name = current.name;
    }
  }


  teamDataPromise.resolve(teamData);
  return teamDataPromise.promise;
}

//Gets and sets the matches to a team's object and then
//returns the team object. 
function populateMatches(teamData, teamNumber, eventCode) {

  var teamMatchPromise = Q.defer();

  var rawMatchPromise = getMatches(teamNumber, eventCode);
  //console.log('made promise')

  rawMatchPromise
    .then(function(data) {
      //console.log('got this from: ' + JSON.stringify(data));
      return storeMatchData(teamData, eventCode, data);
    })
    .then(function(data) {
      //console.log(data);
      //console.log('this');
      teamMatchPromise.resolve(teamData);
    });


  return teamMatchPromise.promise;
  //console.log(teamData);
}

//Returns a promise containing all the matches that 
//a team has played at during an event
function getMatches(teamNumber, eventCode) {
  var rawMatches = Q.defer();

  var options = {
    host: 'private-945e3-frcevents.apiary-proxy.com',
    path: '/api/v1.0/matches/2015/' + eventCode + '?tournamentLevel=qual&teamNumber=' + teamNumber,
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
      var rawMatchesObject = JSON.parse(str);
      rawMatches.resolve(rawMatchesObject);
      //storeMatchData(eventCode, rawMatchesObject);
    });
  };

  http.request(options, callback).end();
  return rawMatches.promise;
}

//sets the match data to a particular event
function storeMatchData(teamData, eventCode, rawMatchesObject) {
  var teamDataPromise = Q.defer();
  var matches = rawMatchesObject.Matches;

  teamData.events[eventCode].matches = matches;
  
  //console.log(teamData.events[eventCode].matches === matches);

  //console.log(teamData);
  teamDataPromise.resolve(teamData);
  return teamDataPromise.promise;
}

//Gets and sets the scores for team, and then
//returns a promise containing the team object
function populateRawScore(teamData, teamNumber, eventCode) {

  var teamDataPromise = Q.defer();

  var rawScorePromise = getRawScores(teamNumber, eventCode);
  //console.log('made promise')

  rawScorePromise
    .then(function(data) {
      //console.log('got this from: ' + JSON.stringify(data));
      return storeScoreData(teamData, eventCode, data);
    })
    .then(function(data) {
      //console.log('this');
      teamDataPromise.resolve(teamData);
    });


  return teamDataPromise.promise;
  //console.log(teamData);
}

//gets the raw scores for a team at an event and 
//then returns a promise containing the scores
function getRawScores(teamNumber, eventCode){
  var rawScoresPromise = Q.defer();

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
      rawScoresPromise.resolve(parsedScoreData);
      //storeScoreData(eventCode, parsedScoreData);
    });
  };

  http.request(options, callback).end();
  return rawScoresPromise.promise;
}

//sets the raw score data
function storeScoreData(teamData, eventCode, parsedScoreData) {
  var storeScorePromise = Q.defer();

  var rawStats = parsedScoreData.Rankings[0];

  teamData.events[eventCode].raw_stats = {};

  for (var key in rawStats) {
    if (rawStats.hasOwnProperty(key)) {
      teamData.events[eventCode].raw_stats[key] = rawStats[key];
    }
  }

  storeScorePromise.resolve(teamData);
  return storeScorePromise.promise;
}

//generates the team object and returns a promise
//containing an object representing the team

function getTeamObject(teamNumber){
  teamData = {};
  console.log('getTeamObject called');
  var teamObjectPromise = Q.defer();

  var promise = getEvents(teamNumber);

  promise
    .then(function(data) { //data is the event data from FIRST api
      return makeSkeleton(teamNumber, data);
    })

    //@TODO: Make this part of the code more efficient. This is way to redundant
    .then(function(skeletonObj) {//sets the raw score data from FIRST api
      var someCode;

      for(var eventCode in skeletonObj.events){
        someCode = eventCode;
        populateRawScore(skeletonObj, teamNumber, eventCode);
      }

      return populateRawScore(skeletonObj, teamNumber, someCode);

    })
    .then(function(populatedScores) {//sets the match data from the FIRST api
      var someCode;

      for(var eventCode in populatedScores.events){
        someCode = eventCode;
        populateMatches(populatedScores, teamNumber, eventCode);
      }

      return populateMatches(populatedScores, teamNumber, someCode);

    })
    .then(function(populatedMatches){
        teamObjectPromise.resolve(populatedMatches);
    });

    return teamObjectPromise.promise;
}

/*
var promise = getTeamObject(303);

promise
.then(function(data){
  console.log(data);
});
*/


module.exports = {
  getTeamObject : function(teamNumber){
    return getTeamObject(teamNumber);
  }
};
