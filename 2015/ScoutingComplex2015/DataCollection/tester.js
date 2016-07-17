var teamRequester = require('./QRequest.js');

var teamInfoPromise = teamRequester.getTeamObject(1923);

//print the data from the promise
teamInfoPromise
.then(function(data){
	console.log(data);
});
