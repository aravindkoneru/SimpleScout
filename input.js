var prompt =require('sync-prompt').prompt;
var scouting = require('./scouting.js')

var choice = prompt("event or team?: ");

if(choice === "event"){
  var teamNumb = prompt("Enter team number: ");
  teamNumb = 'frc' + teamNumb;

  var eventKey = prompt("Enter an event key: ");

  scouting.getEventData(teamNumb, eventKey);

} else if(choice === "team"){
  var teamNumb = prompt("Enter team number: ");
  teamNumb = 'frc' + teamNumb;

  scouting.getSeasonData(teamNumb);

} else{
  console.log("invalid input. run again.")
}
