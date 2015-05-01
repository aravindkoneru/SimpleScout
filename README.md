# SimpleScout
An FRC scouting program written in node.js and powered by [The Blue Alliance API](http://www.thebluealliance.com/apidocs)

## Dependencies

[node-js](https://nodejs.org/download/)

[sync-prompt](https://www.npmjs.com/package/sync-prompt) `npm install sync-prompt`

[underscore.js](http://underscorejs.org/) `npm install underscore`

##Instructions

Currently still under development, so no solid instructions yet.

##Known Bugs/Issues

* Sometimes not all the data is recieved but the calculations are still done. Just running the program again usually fixes the
issue.
* There is no validation at this point to determine if the team number is actually valid. Entering a non-existant team or
a team in the wrong format will throw a nasty error
* You will require an `authkey` or `token` in order to run the complex version of the code. You can request one [here](https://usfirst.collab.net/sf/sfmain/do/viewProject/projects.first_community_developers?_message=1429471256751)

##Goals/Future Work

I am a novice when it comes to asynchronous functions and js in general. If anybody would like to help clean up the code and make
more efficient, I would really aprreciate it. None, the less, I will be developing this project throughout the year to ensure that
it is in its best shape for the 2016 season. The following features are tentatively being thought about:

* Validation in all aspects of the code
* Making asynchronous functions work better with each other
* Creating a filter for the matches analyzed/reviewed
* Creating a website or phone app for easier access
* Display more detailed status using the [FIRST API](http://docs.frcevents.apiary.io/)

##Updates

* 5/1/2015: (Finally) Gained access to the FIRST api and began development on a more concise scouting system

##Conclusion/Notes
Please feel free to contribute and send pull requests. If you have any problems or find
a bug, please rasise an issue. This project is being actively developed and maintained by members of [FRC 1923: The Midknight Inventors](http://firstrobotics1923.org/)
