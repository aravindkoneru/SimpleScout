var http = require('http');
var u = require('underscore');

//given team number, get all events the team played at
function getEvents(teamNum) {
  teamNumber = teamNum;
  var eventInfo;

  var options = {
    host: 'www.thebluealliance.com',
    path: 'www.thebluealliance.com/api/v2/team/' + teamNum + '/events?X-TBA-App-Id=personal:scouting:v01'
  };

  callback = function(response) {
    var str = '';


    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      eventInfo = JSON.parse(str);
      getMatchData(eventInfo, teamNum);
    });
  }

  http.request(options, callback).end();
}

//given an array of all the events the team played at, get a list of all the matches
function getMatchData(eventInfo, teamNum) {
  var options = {
    host: 'www.thebluealliance.com',
    path: '/api/v2/event/<event key>/matches?X-TBA-App-Id=personal:scouting:v01'
  };

  var names = [];

  for (var x = 0; x < eventInfo.length; x++) {
    options.path = '/api/v2/event/' + eventInfo[x].key + '/matches?X-TBA-App-Id=personal:scouting:v01';

    callback = function(response) {
      var str = '';


      response.on('data', function(chunk) {
        str += chunk;
      });


      response.on('end', function() {
        var matchInfo = JSON.parse(str);
        getSpecificMatches(matchInfo, teamNum);
      });
    }

    http.request(options, callback).end();
  }
}

//stores the matches that are important
var matches = [];
var teamNumber;

function setMatchesGlobal(matchInfo) {
  matches.push(matchInfo);
}

//given an array of matches, print the relevant match data and add to global
//this does not print all the matches by default, but it can and also only print certain matches
function getSpecificMatches(matchData, teamNum) {
  //console.log('Event: ' + matchData[0].event_key);
  for (var matchNum = 0; matchNum < matchData.length; matchNum++) {

    var currentMatchAlliances = matchData[matchNum].alliances;
    if (currentMatchAlliances['red']['teams'].indexOf(teamNum) >= 0 || currentMatchAlliances['blue']['teams'].indexOf(teamNum) >= 0) {

      setMatchesGlobal(matchData[matchNum]);

      /*
      console.log(matchData[matchNum].comp_level + " " + matchData[matchNum].match_number)
      console.log(currentMatchAlliances);
      console.log(matchData[matchNum].score_breakdown);
      */

    }
  }
  console.log('.');
}

//analyze all the matches and print some basic stats
function analyze() {
  var highest = 0,
    lowest = 1000000000,
    averageQA = 0,
    averageAuton = 0,
    averageFouls = 0,
    totalNulls = 0,
    averagePlayoff = 0,
    totalPlayoffs = 0;

  for (var matchNum = 0; matchNum < matches.length; matchNum++) {

    var currentMatch = matches[matchNum];
    var currentMatchAlliances = currentMatch['alliances'];
    var alliance = "";

    if (currentMatchAlliances['red']['teams'].indexOf(teamNumber) >= 0) {
      alliance = "red";
    } else {
      alliance = "blue";
    }

    if (currentMatchAlliances[alliance]['score'] >= 0) {
      if (currentMatchAlliances[alliance]['score'] > highest) {
        highest = currentMatchAlliances[alliance]['score'];
      }

      if (currentMatchAlliances[alliance]['score'] < lowest) {
        lowest = currentMatchAlliances[alliance]['score'];
      }

      if (currentMatch.comp_level === 'qm') {
        averageQA += currentMatchAlliances[alliance]['score'];
      } else {
        averagePlayoff += currentMatchAlliances[alliance]['score'];
        totalPlayoffs++;
      }

      averageAuton += matches[matchNum]['score_breakdown'][alliance]['auto'];

      averageFouls += matches[matchNum]['score_breakdown'][alliance]['foul'];

    } else {
      totalNulls++;
    }
  }

  if (totalPlayoffs !== 0) {
    averagePlayoff /= totalPlayoffs;
  }

  averageQA /= matches.length - totalNulls - totalPlayoffs;
  averageFouls /= matches.length - totalNulls;
  averageAuton /= matches.length - totalNulls;

  console.log('Analytics')
  console.log('Team Name: ' + teamName);
  console.log("Highest Number of points: " + highest);
  console.log("Lowest Number of points: " + lowest);
  console.log("Average QA: " + averageQA);
  console.log("Average Playoff Points (If Applicable): " + averagePlayoff);
  console.log("Average Auton points: " + averageAuton);
  console.log("Average Foul points: " + averageFouls);
}

//main function
function getTeamSeasonData(teamNum) {
  var eventInfo = getEvents(teamNum);
  getTeamName(teamNum);
  u.delay(analyze, 1000)
}

function getSpecificEventMatchData(teamNumb, eventKey) {
  teamNumber = teamNumb;
  var options = {
    host: 'www.thebluealliance.com',
    path: '/api/v2/event/2015' + eventKey + '/matches?X-TBA-App-Id=personal:scouting:v01'
  };

  callback = function(response) {
    var str = '';


    response.on('data', function(chunk) {
      str += chunk;
    });

    response.on('end', function() {
      matchInfo = JSON.parse(str);
      getSpecificMatches(matchInfo, teamNumb);
    });
  }

  http.request(options, callback).end();

}

var teamName;

function setNameGlobal(name) {
  teamName = name;
}

function getTeamName(teamNumb) {
  var options = {
    host: 'www.thebluealliance.com',
    path: '/api/v2/team/' + teamNumb + '?X-TBA-App-Id=personal:scouting:v01'
  };

  callback = function(response) {
    var str = '';


    response.on('data', function(chunk) {
      str += chunk;

    });

    response.on('end', function() {
      var name = JSON.parse(str);
      setNameGlobal(name.nickname);
    });
  }

  http.request(options, callback).end();
}

function getTeamEventData(teamNumb, eventKey) {
  getSpecificEventMatchData(teamNumb, eventKey);
  getTeamName(teamNumb);
  u.delay(analyze, 1000);
}

module.exports = {
  getSeasonData: function(teamNumb) {
    getTeamSeasonData(teamNumb)
  },

  getEventData: function(teamNumb, eventKey) {
    getTeamEventData(teamNumb, eventKey);
  }

}
