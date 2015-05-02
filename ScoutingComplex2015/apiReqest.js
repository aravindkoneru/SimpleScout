var http = require('http');
var file = require('read-file');
var u = require('underscore');


//do not change this
var auth = file.readFileSync('authkey.txt');

var teamData = {};

function scrapeTeamStats(teamNumber){
  getEvents(teamNumber);
  //u.delay(console.log(bigEventData), 1000);
}


function storeEventData(teamNumber, parsedEventData){
  teamData['events'] = {};
  for(var x = 0; x < parsedEventData["Events"].length; x++){
    var current = parsedEventData["Events"][x];
    teamData['events'][current.code] = current.name;
  }

  console.log(teamData);

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

getEvents(1923);
