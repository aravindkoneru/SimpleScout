#Documentation

 Although SimpleScout is still in active development, it is currently in a state where someone could use it for an offseason event (if they were willing to use some command line tools and install some stuff on their own). As a result, I think it's important to provide some documentation as to how to run everything and what the function of each file is. 

##Organization

 The Structure of the repository is as follows:

__ScoutingComplex2015__ - This part of the project contains all of the dyanmic code. What I mean by that is, this folder contains all of the code that deals with dynamically getting, setting, and analyzing team info. This is what you would use if you wanted to scout at an actual competition. 

__ScoutingSimple__ - This part of the code is extremely high level api that will only yield some basic information about a team. If you want to do get a general idea of how a team is doing during a season, this would be what you want to use. This part of the program is extremely barebones and it is very unlikely that you will get really in depth statistics about a team unless FIRST releases a low level api. 

##Functions

Currently, these are the 'things' that this program can do:

1. __Generate Excel Files on the Fly__: A common task for any scouting team is to set up an excel database containing all the different teams attending. While this is a relatively simple task, it becomes extremely repetitive. The write function (ScoutingComplex2015/DataEntry/write.js) aims to change this process so it becomes as painless as possible. The first step would be to create an excel file that mimics the layout of the scouting database. Once you have created this file, all you need to do is enter the event code and an excel file containing all the teams attending that competition will be generated and placed in the same directory. If you decide that the sheet needs to be changed mid-match, not problem. Just change the template file to mirror the changes that need to be made, and run write.js again. 

2. __Read Excel Files__: Reads all the data in an excel file and then writes this information as a json object to a file in collectedJSON/team_(teamNumber)

3. __Analyze and Graph Data__: For any given team, by running the generateGraphs file (/ScoutingSImple/AnalyzeData/python/generateGraphs.py), you can create graphs that show a team's progress throughout the event. This is especially useful for comparing the performance of different teams. 

**__IMPORTANT NOTE:__ You only need an internet connection for writing the excel file. All other actions are done locally on the computer and do not require any sort of connection. The graphs generated are svg files and can easily be displayed in localhost by some simple html code. 










