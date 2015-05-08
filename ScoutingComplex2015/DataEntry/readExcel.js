var xlsx = require('xlsx');
var graphs = require('../AnalyzeData/graphData.js');

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
    robotSet: "",
    containerSet: "",
    toteSet: "",
    stackedToteSet: ""
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

function genInfo(location, teamNumber){
  var wb = xlsx.readFile(location);
  return getTeamPayload(wb, teamNumber);
}

//returns a
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
  return payload;
}

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

function setValue(rawObj, findKey, value){
  for(var key in rawObj){
    if(rawObj.hasOwnProperty(key) && typeof rawObj[key] === 'object'){
      setValue(rawObj[key], findKey, value);

    } else if(rawObj.hasOwnProperty(key) && key === findKey && found == false && rawObj[key] === ''){
      rawObj[key] = value;
      found = true;
    }
  }
}

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

function combine(a, b){
  for(var x = 0; x < b.length; x++){
    a.push(b[x]);
  }
  return a;
}


//@TODO:time for some server backend?

graphs.graphBins(genInfo("sample_files/scouting.xlsx", 11), 11);
