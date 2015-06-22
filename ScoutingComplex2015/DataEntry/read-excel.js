var xlsx = require('xlsx');
var file = require('read-file');

var pathname = __dirname.substring(0, __dirname.lastIndexOf('/'));
var fs = require('fs');


var matchSchema = {
  interaction:{
    totes: "",
    bins: ""
  },
  actionsAttempted:{
    robotSet: "",
    containerSet: "",
    toteSet: "",
    stackedToteSet: ""
  },
  actionsCompleted:{
    compeltedRobotSet: "",
    completedContainerSet: "",
    completedToteSet: "",
    completedStackedToteSet: ""
  },
  teleOp:{
    totesStacked: "",
    totesHP: "",
    totesLandfill: ""
  },
  binStacks:{
    size1: "",
    size2: "",
    size3: "",
    size4: "",
    size5: "",
    size6: ""
  },
  coop: {
    obtained: "",
    step: ""
  }
};

var found = false;

//gets the raw data from one sheet
function genInfo(location, teamNumber){
  var wb = xlsx.readFile(location);
  return getTeamPayload(wb, teamNumber);
}

//returns a team payload containing all the scouting data
function getTeamPayload(excelBook, teamNumber){
  var ws = excelBook.Sheets["" + teamNumber];
  var range = xlsx.utils.decode_range(ws["!ref"]);
  var payload = [];
  var keySet = genKeySet(matchSchema);

  for(var row = 2; row <= range.e.r; row++){
    var currentPos = 0;
    for(var col = 0; col <= range.e.c; col++){
      found = false;
      var cellRef = xlsx.utils.encode_cell({r: row, c: col});
      var cell = ws[cellRef];
      //console.log(keySet[currentPos]);

      if(typeof cell === 'undefined'){
        setValue(matchSchema, keySet[currentPos], 'undefined');
        currentPos++;
      } else if(typeof cell !== 'undefined' && cell.t === 'n'){
        //console.log(keySet[currentPos] + ' : ' + cell.v);
        setValue(matchSchema, keySet[currentPos], cell.v);
        currentPos++;
      } else if(typeof cell !== 'undefined' && cell.t === 's'){
        //console.log(keySet[currentPos] + ' : ' + cell.v);
        setValue(matchSchema, keySet[currentPos], true);
        currentPos++;
      }
    }
    //console.log(matchSchema);
    payload.push(JSON.parse(JSON.stringify(matchSchema)));
    setDefault(matchSchema);
  }
  //console.log(payload)
  return payload;
}

//sets the matchSchema to default for another entry
function setDefault(rawObj){
  //console.log(rawObj);
  for(var key in rawObj){
    if(rawObj.hasOwnProperty(key) && typeof rawObj[key] === 'object'){
      setDefault(rawObj[key]);

    } else if(rawObj.hasOwnProperty(key)){
      rawObj[key] = '';
    }
  }
  return rawObj;
}

//sets the value for an attribute
function setValue(rawObj, findKey, value){
  for(var key in rawObj){
    if(rawObj.hasOwnProperty(key) && typeof rawObj[key] === 'object'){
      setValue(rawObj[key], findKey, value);

    } else if(rawObj.hasOwnProperty(key) && key === findKey && found === false && rawObj[key] === ''){
      rawObj[key] = value;
      found = true;
    }
  }
}

//generates a keyset based of off the match schema
function genKeySet(rawObj){
  var keySet = [];
  for(var key in rawObj){
    if(rawObj.hasOwnProperty(key) && typeof rawObj[key] === 'object'){
      keySet = combine(keySet, genKeySet(rawObj[key]));
    } else if(rawObj.hasOwnProperty(key)){
      keySet.push(key);
    }
  }
  return keySet;
}

//combines two arrays
function combine(a, b){
  for(var x = 0; x < b.length; x++){
    a.push(b[x]);
  }
  return a;
}

//reads all of the sheets and sends the data to be written
function genInfoAll(location){
  var wb = xlsx.readFile(location);
  var sheets = wb.SheetNames;

  for(var x = 0; x < sheets.length; x++){
    var teamNumber = parseInt(sheets[x]);

    var payload = getTeamPayload(wb, teamNumber);
    writeDataPoints(teamNumber, payload);
    writeRaw(teamNumber, payload);
  }
}

function writeRaw(teamNumber, payload){
  var outputFilename = pathname + '/collectedJSON/team_' + teamNumber + '/payload.json';

  fs.writeFile(outputFilename, JSON.stringify(payload, null, 4), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFilename);
      }
  });
}

//converts the payload into graph ready data and writes to a file
function writeDataPoints(teamNumber, teamPayload){
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

  var outputFilename = pathname + '/collectedJSON/team_' + teamNumber + '/dataPoints.json';

  fs.writeFile(outputFilename, JSON.stringify(dataPoints, null, 4), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFilename);
      }
  });
}

function readExcel(location){
  genInfoAll(location);
}

module.exports = {
	read: readExcel
};
