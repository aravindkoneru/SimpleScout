var fs = require('fs');
var Q = require('q');

function getDataPoints(teamNumber) {
  var obj = JSON.parse(fs.readFileSync('../collectedJSON/team_' + teamNumber + '/dataPoints.json', 'utf8'));
  return obj;
}


//calculates the sample standard deviation
function calcStDevInt(arrayOfValues) {

  var mean = 0;
  var x;
  for (x = 0; x < arrayOfValues.length; x++) {
    mean += arrayOfValues[x];
  }


  mean /= arrayOfValues.length;

  var sDev = 0;

  for (x = 0; x < arrayOfValues.length; x++) {
    sDev += Math.pow(arrayOfValues[x] - mean, 2);
  }


  sDev /= arrayOfValues.length - 1;

  sDev = Math.sqrt(sDev, 1 / 2);


  return sDev;
}

function calcStDevBool(arrayOfValues) {
  var mean = 0;
  var x;

  for (x = 0; x < arrayOfValues.length; x++) {
    if (arrayOfValues[x] === true) mean += 1;
  }

  mean /= arrayOfValues.length;

  var sDev = 0;

  for (x = 0; x < arrayOfValues.length; x++) {
    if (arrayOfValues[x] === true) {
      sDev += Math.pow(1 - mean, 2);
    } else {
      sDev += Math.pow(0 - mean, 2);
    }
  }

  sDev /= arrayOfValues.length - 1;

  //console.log('FASDFASDFASDF'  + sDev);

  sDev = Math.sqrt(sDev, 1 / 2);

  return sDev;
}

function calcAvgBool(arrayOfValues){
  var mean = 0;
  var x;

  for(x = 0; x < arrayOfValues.length; x++){
    if(arrayOfValues[x] === true) mean += 1;
  }

  return mean/arrayOfValues.length;
}

function calcAvgInt(arrayOfValues){
  var mean = 0;
  var x;
  for (x = 0; x < arrayOfValues.length; x++) {
    mean += arrayOfValues[x];
  }


  return mean / arrayOfValues.length;
}




function makeCalculations(teamNumber) {
  var analytics = {};
  analytics.stDev = {};
  analytics.avg = {};

  var dataPoints = getDataPoints(teamNumber);

  //console.log(dataPoints);

  for(var key in dataPoints){

    if(dataPoints.hasOwnProperty(key) && dataPoints[key][0] % 1 === 0 && typeof dataPoints[key][0] !== 'boolean'){
      analytics.stDev[key] = calcStDevInt(dataPoints[key]);
      analytics.avg[key] = calcAvgInt(dataPoints[key]);

    } else if(dataPoints.hasOwnProperty(key) && typeof dataPoints[key][0] === 'boolean' || dataPoints[key][0] === 'undefined'){
      analytics.stDev[key] = calcStDevBool(dataPoints[key]);
      analytics.avg[key] = calcAvgBool(dataPoints[key]);
    }
  }
  return analytics;
}

function analyzeData(teamNumber){
  var analytics = makeCalculations(teamNumber);

  var outputFilename = '../collectedJSON/team_' + teamNumber + '/analytics.json';

  fs.writeFile(outputFilename, JSON.stringify(analytics, null, 4), function(err) {
      if(err) {
        console.log(err);
      }
  });
}
