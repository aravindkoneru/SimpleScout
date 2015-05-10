var file = require('read-file')
var auth = file.readFileSync(__dirname + '/plotlyAuth.txt');
//console.log(auth.substring(auth.indexOf('\n')+1, auth.length))
var plotly = require('plotly')(auth.substring(0, auth.indexOf('\n')), auth.substring(auth.indexOf('\n')+1, auth.length-1));
var fs = require('fs');



module.exports = {
  writeGraphData: setGraphData
};


function setGraphData(teamPayload, teamNumber){
  //console.log(teamPayload);
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


  return dataPoints;
}









/*

var data = [{x:[0,1,2], y:[1,2,1], type: 'bar'}];
var graphOptions = {fileopt : "extend", filename : "nodenodenode", world_readable: false};

plotly.plot(data, graphOptions, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);
});
*/
