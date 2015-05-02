//FIXME: if the value is undefined, try to find a defined value. The only case
//where this errors occurs is when the team has been to champs and their score
//is stored under the division as opposed to the header.

//this returns the sample standard deviation (s)
function statStandardDev(args){
  var teamData = args[0];
  var someStat = args[1];

  var statVals = [];
  for(var key in teamData['events']){
    if(teamData['events'].hasOwnProperty(key)){
      statVals.push(teamData['events'][key]['raw_stats'][someStat]);
    }
  }

  var mean = 0;

  for(var x = 0; x < statVals.length; x++){
    if(typeof statVals[x] === 'undefined'){
      statVals.splice(x, 1);
      console.warn('found an undefined value while calculating standard dev.')
    }
  }

  for(var x = 0; x < statVals.length; x++){
    mean += statVals[x];
  }
  mean /= statVals.length;

  var sDev = 0;

  for(var x = 0; x < statVals.length; x++){
    sDev += Math.pow(statVals[x]-mean, 2);

  }

  sDev /= statVals.length-1;
  sDev = Math.sqrt(sDev);

  console.log(sDev);
  return sDev;
}

module.exports = {
  sDev: statStandardDev
}
