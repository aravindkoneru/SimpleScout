# SimpleScout
An FRC scouting program written in node.js and powered by [The Blue Alliance API](http://www.thebluealliance.com/apidocs) and the [FIRST API](http://docs.frcevents.apiary.io/)

## Dependencies

[node-js](https://nodejs.org/download/)

[sync-prompt](https://www.npmjs.com/package/sync-prompt) `npm install sync-prompt`

[underscore.js](http://underscorejs.org/) `npm install underscore`

[read-file](https://www.npmjs.com/package/read-file) `npm i read-file --save`

[xlsx.js](https://www.npmjs.com/package/xlsx) `npm install xlsx`

[plotly](https://plot.ly/feed/) `npm install plotly` (May not make final release)

[python-shell](https://www.npmjs.com/package/python-shell#running-a-python-script-with-arguments-and-options) `npm install python-shell`

[plotly](https://plot.ly/python/getting-started/) `pip install plotly`

##Instructions

Currently still under development, so no solid instructions yet.

##Known Bugs/Issues

* Sometimes not all the data is received but the calculations are still done. Just running the program again usually fixes the
issue.
* There is no validation at this point to determine if the team number is actually valid. Entering a non-existant team or
a team in the wrong format will throw a nasty error
* You will require an `authkey` or `token` in order to run the complex version of the code. You can request one [here](https://usfirst.collab.net/sf/sfmain/do/viewProject/projects.first_community_developers?_message=1429471256751)

##Goals/Future Work

I am a novice when it comes to asynchronous functions and js in general. If anybody would like to help clean up the code and make
more efficient, I would really appreciate it. None the less, I will be developing this project throughout the year to ensure that
it is in its best shape for the 2016 season. The following features are tentatively being thought about:

* Validation in all aspects of the code
* Making asynchronous functions work better with each other
* Creating a filter for the matches analyzed/reviewed
* Creating a website or phone app for easier access
* Display more detailed status using the [FIRST API](http://docs.frcevents.apiary.io/)

##Updates

* 5/1/2015: (Finally) Gained access to the FIRST api and began development on a more concise scouting system
* 5/2/2015: Basic functionality for scraping team data from the FIRST api is complete (much more data gathered than from the blue alliance)
* 5/5/2015: Began working on bulk data entry (excel) and auto generation of excel files
* 5/7/2015: Began working on the graphs and other analytics
* 5/8/2015: Looking into python for plotting data instead of using node.js (want to locally generate graphs)

##Conclusion/Notes
Please feel free to contribute and send pull requests. If you have any problems or find
a bug, please rasise an issue. This project is being actively developed on behalf of [FRC 1923: The Midknight Inventors](http://firstrobotics1923.org/)
