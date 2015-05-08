var file = require('read-file')
var auth = file.readFileSync(__dirname + '/plotlyAuth.txt');
console.log(auth.substring(auth.indexOf('\n')+1, auth.length))
var plotly = require('plotly')(auth.substring(0, auth.indexOf('\n')), auth.substring(auth.indexOf('\n')+1, auth.length-1));

module.exports = {
  graphBins: graphBins
};

function graphBins(scoutingData, teamNumb){
  var matchNum = [];
  var binsInteracted = [];

  for(var x = 0; x < scoutingData.length; x++){
    var current = scoutingData[x];
    matchNum.push(x+1);
    binsInteracted.push(current['interaction']['bins']);
  }

  var data = [{x: matchNum, y: binsInteracted, type: 'scatter'}]
  var graphOptions = {fileopt: "extend", filename: "Team " + teamNumb + ": Bins Interacted", world_readable: false};

  plotly.plot(data, graphOptions, function(err, msg){
    if(err) return console.log(err);
    console.log(msg);
  })
}









/*

var data = [{x:[0,1,2], y:[1,2,1], type: 'bar'}];
var graphOptions = {fileopt : "extend", filename : "nodenodenode", world_readable: false};

plotly.plot(data, graphOptions, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);
});
*/
