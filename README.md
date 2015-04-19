# SimpleScout
An FRC scouting program written in node.js and powered by [The Blue Alliance API](http://www.thebluealliance.com/apidocs)

## Dependencies

[node-js](https://nodejs.org/download/)

[sync-prompt](https://www.npmjs.com/package/sync-prompt) `npm install sync-prompt`

[underscore.js](http://underscorejs.org/) `npm install underscore`

##Instructions

Run input.js and enter the team number that you want to search for. Within a few seconds, 
you will have a comprehensive list of stats of that team.

##Known Bugs/Issues

* Sometimes not all the data is recieved but the calculations are still done. Just running the program again usually fixes the 
issue. 
* There is no validation at this point to determine if the team number is actually valid. Entering a non-existant team or 
a team in the wrong format will throw a nasty error

##Goals/Future Work

I am a novice when it comes to asynchronous functions and js in general. If anybody would like to help clean up the code and make
more efficient, I would really aprreciate it. None, the less, I will be developing this project throughout the year to ensure that
it is in its best shape for the 2016 season. The following features are tentatively being thought about:

* Validation in all aspects of the code
* Making asynchronous functions work better with each other
* Creating a filter for the matches analyzed/reviewed
* Creating a website or phone app for easier access

##Conclusion/Notes
Please feel free to contribute and send pull requests. If you have any problems or find
a bug, please rasise an issue. This project is open source and is meant to be used by all teams. It is currently under development
by members of [FRC 1923: The Midknight Inventors](http://firstrobotics1923.org/)






