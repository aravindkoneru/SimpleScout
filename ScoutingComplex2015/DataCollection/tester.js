var teamRequester = require('./QRequest.js');

var teamInfoPromise = teamRequester.getTeamObject(1923);

teamInfoPromise
.then(function(data){
	console.log(data);
});